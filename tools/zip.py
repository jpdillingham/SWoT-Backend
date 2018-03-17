#!/usr/bin/env python
import os
import zipfile
import shutil

def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        for file in files:
            print(os.path.join(root, file))
            ziph.write(root + "/" + file)

if __name__ == '__main__':
    shutil.make_archive('../build/swot.zip', 'zip', '../node_modules')
    # zipf = zipfile.ZipFile('swot.zip', 'w', zipfile.ZIP_DEFLATED)
    # zipdir('', zipf)
    # zipf.close()