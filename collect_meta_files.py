import os, json, re

META_FILE_NAME = '_meta.json'
meta_file_map = {}

def get_version_sort_key(v):
    return re.sub(r'(\d+)', lambda n: str(int(n.group(0)) + 1000), v)

for root, subdirs, files in os.walk('cards'):
    if META_FILE_NAME in files:
        meta_file_path = os.path.join(root, META_FILE_NAME)
        with open(meta_file_path, 'r') as f:
            meta_data = json.load(f)
            most_recent_version = sorted(subdirs, key=get_version_sort_key)[-1]
            meta_data['_most_recent_version'] = most_recent_version
            meta_data['_folder_path'] = root
            meta_data['_category'] = os.path.split(os.path.split(root)[0])[1];

            char_key = os.path.split(root)[-1]
            meta_file_map[char_key] = meta_data
            
with open("./site/src/combined_meta_json.ts", 'w') as f:
    content = "export const CUSTOM_DATA_MAP : any = " + json.dumps(meta_file_map)
    f.write(content)