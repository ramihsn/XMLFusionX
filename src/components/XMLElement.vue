<template>
    <div class="container" >
        <!-- ensure the right amount of indentation -->
        <div class="box" v-for="i in Array.from(Array(indentation).keys())" :key="i"></div>
        <div class="icon" v-if="children.length > 0" @click="toggle">
            <font-awesome-icon icon="fa-solid fa-caret-down" :class="{'fa-rotate-270': !isExpanded}" />
        </div>
        <div v-else style="margin-right: 20px;"></div>

        <div class="name" :title="attributesToString()">
            <strong>{{ name }} :</strong>
        </div>

        <div class="value" v-if="children.length === 0" @dblclick="onDoubleClick">
            <div
                v-if="!isEditing"
                title="Double click to edit"
            >
                {{ value }}
            </div>
            <input
                v-else
                type="text"
                ref="input"
                v-model="value"
                @blur="onSave"
                @keyup.enter="onSave"
                @keyup.escape="abortEditing"
            />
        </div>
    </div>

    <div class="children" v-if="children.length > 0">
        <div v-show="isExpanded" v-for="child of children" :key="child.key+'-'+child.indentation">
            <XMLElement
                ref="child"
                :name="child.key"
                :values="child.values"
                :attributes="child.attributes"
                :indentation="indentation + 1"
                :historyManager="historyManager"
            />
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';

import { processXMLNode, attributeToString } from '@/utils/helpers';

export default {
    name: 'XMLElement',
    expose: ['serialize'],
    props: {
        name: String,
        values: null,
        attributes: null,
        indentation: {
            type: Number,
            default: 0
        },
        historyManager: Object
    },
    setup() {
        const children = ref([]);

        const value = ref(null);

        const isExpanded = ref(true);
        const isEditing = ref(false);
        const editHover = ref(false);

        return {
            children,
            value,
            isExpanded,
            isEditing,
            editHover,
        };
    },
    data(props) {
        let lastValue = null;

        const onSave = () => {
            if (this.value !== lastValue) {
                props.historyManager.saveState(
                    { 'undo': this.undo, 'redo': this.redo },
                    { lastValue, value: this.value }
                );
                lastValue = this.value;
            }
            this.isEditing = false;
        }

        const abortEditing = () => {
            this.value = lastValue;
            this.isEditing = false;
        }

        this.parseValues(props.values);
        lastValue = this.value;

        return { onSave, abortEditing };

    },
    methods: {
        serialize() {
            const indentation = '  '.repeat(this.indentation);
            const end = `</${this.name}>`;
            let serializedChildren = '';
            let result = '';

            // construct the beginning of the tag
            let start = `<${this.name}`;
            // check if the tag had an attributes - store them
            if (this.attributes && Object.keys(this.attributes).length > 0) {
                start += ' ' + Object.entries(this.attributes)
                    .map(([key, attributes]) => attributeToString(key, attributes))
                    .join(' ')
            }
            start += ">"

            // construct the content (value or children) of the tag
            if (this.$refs.child) {  // the tag most likely have children - serialize them
                this.$refs.child.forEach(child => {
                    serializedChildren += child.serialize();
                });
            } else {  // the tag have value - store the value
                serializedChildren += this.value;
            }

            // construct the closing of the tag
            if (this.value === null) {  // the tag most likely have children - add new line after opening tag
                result = `${indentation}${start}\n`;
                if (serializedChildren.length > 0) {
                    result += `${serializedChildren}`;
                }
                result += `${indentation}${end}\n`
            } else {  // the tag don't have value - construct in a single line
                result = `${indentation}${start}${this.value}${end}\n`;
            }

            return result;
        },
        attributesToString() {
            if (this.attributes) {
                return Object.entries(this.attributes).map(([key, value]) => `${key.slice(2)}: ${value}`).join('\n');
            }
            return '';
        },
        onDoubleClick() {
            this.isEditing = true;
            this.$nextTick(() => {
                this.$refs.input.focus();
            });
        },
        toggle() {
            this.isExpanded = !this.isExpanded;
        },
        parseValues(values) {
            if ( typeof values === 'string' || typeof values === 'number' ) {
                this.value = (typeof values === 'number' && values.toString().length > 15)
                    ? values.toLocaleString('fullwide', { useGrouping: false })
                    : values;

            } else {
                values.forEach(({key, values}) => {
                    if (typeof values === 'string' || typeof values === 'number') {
                        this.children.push({ key, values });
                    } else {
                        const result = processXMLNode(values, key)
                        this.children.push(result);
                    }
                });
            }
        },
        undo(state) {
            const { lastValue, value } = state;
            this.value = lastValue;
            this.lastValue = value;
        },
        redo(state) {
            const { lastValue, value } = state;
            this.value = value;
            this.lastValue = lastValue;
        }
    },
}
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: row;

    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: transparent;
    --rem: 16;
    --fsAddBuffer: 22px;
    --fsAncillary: var(--use);
    border-spacing: 0;
    border-collapse: collapse;
    text-align: left;
    -webkit-user-modify: read-only;
    box-sizing: border-box;
    border: 1px solid transparent;
    min-height: 16px;
    min-width: 32px;
    line-height: 16px;
    padding: 2px;
    margin: 1px;
    word-wrap: break-word;
    font-family: consolas,menlo,monaco,ubuntu mono,source-code-pro,monospace;
    font-size: 14px;
    color: #1a1a1a;
}

.icon, .name {
    padding-right: 10px;
}

.value {
    min-width: 300px;
}

.value input {
    width: 100%;
}

.box {
    min-width: 20px;
}
</style>