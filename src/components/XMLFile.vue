<template>
    <div class="xml-file">
        <div class="xml-file-header">
            <div
                v-if="!isEditing"
                @dblclick="onDoubleClick"
                class="file-title"
                title="Double click to edit"
            >
                {{ editableFileName }}
            </div>
            <input
                v-else
                ref="input"
                type="text"
                v-model="editableFileName"
                @blur="saveFileName"
                @keyup.enter="saveFileName"
                @keyup.escape="isEditing = false"
                class="file-title-input file-title"
            />
            <div class="icon">
                <font-awesome-icon
                    @click="downloadFile"
                    @mouseover="downloadFileHover = true"
                    @mouseout="downloadFileHover = false"
                    :class="[{'fa-bounce': hasUndo && downloadFileHover}, !hasUndo ? 'fa-disabled' : '']"
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

        <div class="actions">
            <font-awesome-icon
                @click="undo"
                flip="horizontal"
                icon="fa-solid fa-arrow-right"
                :class="[hasUndo ? 'icon' : 'fa-disabled']"
            />
            <font-awesome-icon
                @click="redo"
                icon="fa-solid fa-arrow-right"
                :class="[hasRedo ? 'icon' : 'fa-disabled']"
            />
        </div>

        <div v-if="showSpinner" class="spinner">
            <font-awesome-icon icon="fa-solid fa-spinner" spin size="10x"/>
        </div>
        <div v-else class="xml-file-content scrollable">
            <XMLElement
                v-for="(el, idx) in rootXmlObjects"
                :key="idx"
                :name="el.key"
                :values="el.values"
                :attributes="el.attributes"
                :historyManager="historyManager"
                ref="elements"
            />
        </div>
    </div>
</template>

<script>
import { ref, nextTick } from 'vue';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

import XMLElement from './XMLElement.vue';
import { processXMLNode, attributeToString } from '@/utils/helpers';
import HistoryManager from '@/utils/historyManager';

export default {
    name: 'XMLFile',
    components: {
        XMLElement
    },
    props: {
        file: File,
    },
    setup(props) {
        const historyManager = new HistoryManager();
        const xmlContent = '';
        const isEditing = ref(false);
        const editableFileName = ref(props.file.name);
        const rootXmlObjects = ref([]);
        const showSpinner = ref(true);
        const rmFileHover = ref(false);
        const downloadFileHover = ref(false);
        const xmlAttributes = ref(null)

        return {
            historyManager,
            xmlContent,
            isEditing,
            editableFileName,
            rootXmlObjects,
            showSpinner,
            rmFileHover,
            downloadFileHover,
            xmlAttributes,
        };

    },
    mounted() {
        this.parseXML(this.file).then(() => this.showSpinner = false);
    },
    computed: {
        hasUndo() {
            return this.historyManager.hasUndo;
        },
        hasRedo() {
            return this.historyManager.hasRedo;
        },
    },
    methods: {
        async downloadFile () {
            if (!this.historyManager.hasUndo) {
                return;  // the file has not been edited, nothing to download
            }

            await nextTick();
            let serializedData = `<?xml ${
                Object.entries(this.xmlAttributes).map(([key, values]) => attributeToString(key, values))
            }?>\n`;
            this.$refs.elements.forEach(element => {
                serializedData += element.serialize();
            });

            const blob = new Blob([serializedData.trim()], { type: 'application/xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.editableFileName;
            a.click();
            URL.revokeObjectURL(url);
        },
        /**
         * @param {File} file
         * @returns {Promise<String>}
         */
        async getFileContent(file) {
            const arrayBuffer = await file.arrayBuffer();
            const text = new TextDecoder("utf-8").decode(arrayBuffer);

            if (text.includes('�')) {
                console.log('needs fixing');
                // Manually decode as windows-1255 and then re-encode to UTF-8
                const windows1255Text = new TextDecoder('windows-1255').decode(arrayBuffer);
                return new TextDecoder("utf-8").decode(new TextEncoder().encode(windows1255Text));
            }
            return text;
        },
        async parseXML (file) {
            const content = await this.getFileContent(file);
            this.xmlContent = content;
            const parser = new XMLParser({ignoreAttributes: false, attributeNamePrefix: '@_'});
            const result = parser.parse(content);

            this.rootXmlObjects = Object.entries(result).map(([key, value]) => processXMLNode(value, key));

            // get the xml metadata, and remove it from the structure
            const xmlValuesIdx = this.rootXmlObjects.find(({key}) => key == '?xml')
            if (xmlValuesIdx) {
                this.xmlAttributes = xmlValuesIdx.attributes
                this.rootXmlObjects = this.rootXmlObjects.filter(({key}) => key != xmlValuesIdx.key)
            }
        },
        saveFileName() {
            this.isEditing = false;
            this.editableFileName = this.editableFileName.trim();
        },
        removeFile() {
            this.$emit('remove-file', this.file);
        },
        onDoubleClick() {
            this.isEditing = true;
            this.$nextTick(() => {
                this.$refs.input.focus();
            });
        },
        undo() {
            if ( this.historyManager.hasUndo ) {
                this.historyManager.undo();
            }
        },
        redo() {
            if ( this.historyManager.hasRedo ) {
                this.historyManager.redo();
            }
        },
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

.xml-file-header .icon, .actions .icon {
    cursor: pointer;
}

.xml-file-header .icon {
    margin-left: 10px;
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

.spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.actions {
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 10px;
    margin-right: 10px;
}
</style>