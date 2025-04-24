import { createClient } from "@/utils/supabase/server";

export type ImageMetadata = {
    id: string,
    created_at: string,
    timestamp: number,
    chunk_id: number,
    total_chunks: number,
    file_path: string
    public_url: string
}

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

            return {
                ...image,
                public_url: imageFromBucket?.publicUrl || "",
            }
        })
    )

    return dataImage;

}