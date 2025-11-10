from openai import OpenAI
client = OpenAI()

# Your vector store ID
VS_ID = "vs_6910dedb369c81918640e1f1b97ae027"

# Map each file name to its device_id
tags = {
    "foresight_elite.pdf": "CASMED-FORESIGHT-ELITE",
    "Service Manual Nico2.pdf": "NICO2",
    "Service Manual Nellcor N-395.pdf": "Nellcor-N-395",
}

# List all files in the vector store
store = client.vector_stores.retrieve(VS_ID)
files = store.file_counts

# Update metadata for each file
for file in client.vector_stores.files.list(vector_store_id=VS_ID):
    file_name = file.name
    device_id = tags.get(file_name)
    if not device_id:
        print(f"Skipping {file_name}")
        continue

    print(f"Tagging {file_name} → device_id={device_id}")
    client.vector_stores.files.update(
        vector_store_id=VS_ID,
        file_id=file.id,
        metadata={"device_id": device_id}
    )

print("✅ Metadata added.")
