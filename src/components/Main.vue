<template>
    <div class="container">
        <div v-for="file in xmlFiles" :key="file.name" class="xml-file-wrapper">
            <XMLFile :file="file" @remove-file="onRemoveFile" />
        </div>
        <!-- Limit the number of XML files to 2 for now -->
        <div v-if="xmlFilesLen < 2" class="file-upload-wrapper" :class="{'hover': xmlFilesLen === 1}" >
            <FileUpload @file-upload="onFileUploaded" :counter="xmlFilesLen"  />
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';

import FileUpload from './FileUpload.vue';
import XMLFile from './XMLFile.vue';

export default {
    name: 'Main',
    components: {
        FileUpload,
        XMLFile,
    },
    setup() {
        const xmlFiles = ref([]);

        return {
            xmlFiles,
        };
    },
    computed: {
        xmlFilesLen() {
            return this.xmlFiles.length;
        }
    },
    methods: {
        async loadFile(filePath) {
            const response = await fetch(filePath);
            const text = await response.text()
            return new File([text], 'sample.xml', { type: 'text/xml' });
        },
        onFileUploaded(files) {
            for (const file of files) {
                if (/\.xml$|\.dat$/i.test(file.name)) {
                    const fileExists = this.xmlFiles.some(f => f.name === file.name);
                    // Limit the number of XML files to 2 for now
                    if (!fileExists && this.xmlFilesLen < 2) {
                        this.xmlFiles.push(file);
                        console.log(`File added: ${file.name}`);
                    } else {
                        console.warn(`File already exists:`, file);
                    }
                } else {
                    console.error(`Invalid file type:`, file);
                }
            }
        },
        onRemoveFile(file) {
            this.xmlFiles = this.xmlFiles.filter(f => f.name !== file.name);
        }
    },
}
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 90vh;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    overflow: hidden; /* Prevent scrolling */
}

.xml-file-wrapper,
.file-upload-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: 10px;
    height: 100%;
}

.xml-file-wrapper {
    flex: 1 1 50%;
    max-width: 100%;
    height: 100%;
}

.file-upload-wrapper {
    flex: 1;
    max-width: 100%;
    padding-left: 20px;
    height: 100vh;
}

.container > .xml-file-wrapper + .file-upload-wrapper {
    padding-left: 20px;
}

.container > .xml-file-wrapper:nth-child(2) {
    padding-left: 20px;
}

@media (max-width: 768px) {
    .container {
        flex-direction: column;
        height: auto;
    }
    .xml-file-wrapper,
    .file-upload-wrapper {
        max-width: 100%;
        flex: 1;
        padding: 10px 0;
    }
    .container > .xml-file-wrapper + .xml-file-wrapper {
        padding-left: 0;
        padding-top: 20px;
    }
    .container > .xml-file-wrapper + .file-upload-wrapper {
        padding-left: 0;
        padding-top: 20px;
    }
}

.hover {
    z-index: 1000;
} 
</style>