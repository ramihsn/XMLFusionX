<template>
    <div class="xml-file">
        <div class="xml-file-header">
            <div
                v-if="!isEditing"
                @dblclick="isEditing = true"
                class="file-title"
                title="Double click to edit"
            >
                {{ editableFileName }}
            </div>
            <input 
                v-else
                type="text"
                v-model="editableFileName"
                @blur="saveFileName"
                @keyup.enter="saveFileName"
                class="file-title-input file-title"
            />
            <div class="icon">
                <font-awesome-icon
                    @click="downloadFile"
                    @mouseover="downloadFileHover = true"
                    @mouseout="downloadFileHover = false"
                    :class="{'fa-bounce': downloadFileHover}"
                    icon="fa-solid fa-cloud-arrow-down" size="2x"
                />
            </div>
            <div class="icon">
                <font-awesome-icon
                    @click="removeFile"
                    @mouseover="rmFileHover = true"
                    @mouseout="rmFileHover = false"
                    :class="{'fa-bounce': rmFileHover}"
                    icon="fa-regular fa-trash-can" size="2x"
                />
            </div>
        </div>
        <div class="xml-file-content scrollable">
            <pre>{{ xmlContent }}</pre>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    name: 'XMLFile',
    props: {
        file: File
    },
    setup(props, { emit }) {
        let xmlContent = ref('');
        let isEditing = ref(false);
        let editableFileName = ref(props.file.name);

        props.file.text().then(content => {
            xmlContent.value = content;
        });
        
        const saveFileName = () => {
            isEditing.value = false;
        };

        const removeFile = () => {
            emit('remove-file', props.file);
        }

        const downloadFile = () => {
            const url = URL.createObjectURL(props.file);
            const a = document.createElement('a');
            a.href = url;
            a.download = editableFileName.value;
            a.click();
            URL.revokeObjectURL(url);
        }

        return {
            file: props.file, isEditing, xmlContent, editableFileName, // vars
            removeFile, saveFileName, downloadFile, // funcs
        };
    },
    data() {
        return {
            rmFileHover: false,
            downloadFileHover: false
            
        };
    },
}
</script>

<style scoped>
.xml-file {
    border: 1px solid #ccc;
    border-radius: 8px;
    margin: 10px;
    padding: 10px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.xml-file-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.file-title {
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: normal;
    flex-grow: 1;
    max-width: calc(100% - 100px);
}

.file-title-input {
    padding: 0 5px;
}

.xml-file-header .icon {
    margin-left: 10px;
    cursor: pointer;
}

.xml-file-content {
    flex-grow: 1;
    overflow: auto;
    max-height: calc(100% - 15px);
}

.scrollable {
    flex-grow: 1;
    overflow: auto;
    border: 1px solid #ddd;
    padding: 5px;
    border-radius: 5px;
    max-height: calc(100% - 15px);
}
</style>