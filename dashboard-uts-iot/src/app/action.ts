import { createClient } from "@/utils/supabase/server";

export type ImageMetadata = {
    id: string,
    created_at: string,
    timestamp: number,
    receive_at: string,
    send_at: string,
    total_chunks: number,
    file_path: string,
    file_size: number,
    avg_chunk_size: number,
    transmission_efficiency: number,
    public_url: string
    latency: number,
}

export type DataChart = {
    timestamp: string,
    latency: number,
}

const CHUNK_SIZE = 8192;

export async function getData() {
    const supabase = await createClient();
    const { data: image_metadata } = await supabase
        .from("image_metadata")
        .select();

    if (!image_metadata) {
        throw new Error("No data found");
    }

    const dataImage = await Promise.all(
        image_metadata.map(async (image: ImageMetadata) => {
            const { data: imageFromBucket } = await supabase.storage.from("if4051-uts-iot-bucket").getPublicUrl(image.file_path, {
                download: false,
            });
            const avg_chunk_size = image.file_size / image.total_chunks;
            const transmission_efficiency = (avg_chunk_size * 1024 / CHUNK_SIZE) * 100;

            return {
                ...image,
                avg_chunk_size: avg_chunk_size,
                transmission_efficiency: transmission_efficiency,
                public_url: imageFromBucket?.publicUrl || "",
            }
        })
    )

    const latencies = dataImage.map((data) => (data.latency));
    const avgLatencies = latencies.reduce((acc: number, cur: number) => acc + cur, 0) / latencies.length;

    const maxLatency = Math.max(...latencies);
    const minLatency = Math.min(...latencies);


    return {
        avgLatencies,
        maxLatency,
        minLatency,
        dataImage
    };
}
