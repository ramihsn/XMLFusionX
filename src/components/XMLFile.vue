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

        <div class="actions">
            <font-awesome-icon
                @click="undo"
                flip="horizontal"
                icon="fa-solid fa-arrow-right"
                :style="{ color: hasUndo ? activeArrowColor : disabledArrowColor }"
            />
            <font-awesome-icon
                @click="redo"
                icon="fa-solid fa-arrow-right"
                :style="{ color: hasRedo ? activeArrowColor : disabledArrowColor }"
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
import { processXMLNode } from '@/utils/helpers';
import HistoryManager from '@/utils/historyManager';

export default {
    name: 'XMLFile',
    components: {
        XMLElement
    },
    props: {
        file: File,
    },
    setup(props, { emit }) {
        const historyManager = new HistoryManager()

        const xmlContent = ref('');
        const isEditing = ref(false);
        const editableFileName = ref(props.file.name);

        const isEdited = ref(false);
        const rootXmlObjects = ref([]);
        const showSpinner = ref(true);

        const parseXML = async () => {
            const content = await props.file.text();
            xmlContent.value = content;
            const parser = new XMLParser({ignoreAttributes: false, attributeNamePrefix: '@_'});
            const result = parser.parse(content);

            rootXmlObjects.value = Object.keys(result).map(key => processXMLNode(result[key], key));
            showSpinner.value = false;
        };

        parseXML();

        const saveFileName = () => {
            isEditing.value = false;
        };

        const markAsEdited = (name, value) => {
            xmlObject.value[name] = value;
            isEdited.value = true;
        };

        const removeFile = () => {
            emit('remove-file', props.file);
        };

        return {
            file: props.file, isEditing, xmlContent, rootXmlObjects, editableFileName, isEdited, showSpinner, historyManager, // vars
            removeFile, saveFileName, markAsEdited,
        };
    },
    data() {
        return {
            rmFileHover: false,
            downloadFileHover: false,
            activeArrowColor: "#1E3050",
            disabledArrowColor: "#E8E8E8",
        };
    },
    computed: {
        hasUndo() {
            return this.historyManager.hasUndo;
        },
        hasRedo() {
            return this.historyManager.hasRedo;
        }
    },
    methods: {
        async downloadFile () {
            await nextTick();
            const builder = new XMLBuilder();
            const serializedData = this.rootXmlObjects.reduce((acc, el, idx) => {
                const elRef = this.$refs.elements[idx];
                if (elRef && elRef.serialize) {
                    acc[el.key] = elRef.serialize();
                }
                return acc;
            }, {});
            const xml = builder.build(serializedData);
            const blob = new Blob([xml], { type: 'application/xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.editableFileName;
            a.click();
            URL.revokeObjectURL(url);
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