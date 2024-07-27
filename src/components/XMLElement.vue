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

import { processXMLNode } from '@/utils/helpers';

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
    setup(props) {
        const children = ref([]);

        let originalValue = null;
        const value = ref(null);

        const isExpanded = ref(true);
        const isEditing = ref(false);
        const editHover = ref(false);

        if ( typeof props.values === 'string' || typeof props.values === 'number' ) {
            value.value = (typeof props.values === 'number' && props.values.toString().length > 15)
                ? props.values.toLocaleString('fullwide', { useGrouping: false })
                : props.values;

            if (originalValue === null) {
                originalValue = value.value
                // lastValue = value.value;
            } else {
                // lastValue = value.value;
            }
        } else {
            props.values.forEach(({key, values}) => {
                if (typeof values === 'string' || typeof values === 'number') {
                    children.value.push({ key, values });
                } else {
                    const result = processXMLNode(values, key)
                    children.value.push(result);
                }
            });
        }

        const toggle = () => {
            isExpanded.value = !isExpanded.value;
        };

        return {
            value, children, isExpanded, isEditing, editHover,
            toggle, // serialize,
        };
    },
    data(props) {
        let lastValue = this.value;

        const onSave = () => {
            if (this.value !== lastValue) {
                props.historyManager.saveState(this, { lastValue, value: this.value });
                lastValue = this.value;
            }
            this.isEditing = false;
        }

        const abortEditing = () => {
            this.value = lastValue;
            this.isEditing = false;
        }

        return { onSave, abortEditing };

    },
    methods: {
        serialize() {
            if (this.value !== null) {
                if (this.attributes) {
                    return { [this.name]: { value: this.value, attributes: this.attributes } };
                }
                return { [this.name]: this.value };
            }
            const serializedChildren = this.$refs.child.reduce((acc, child) => {
                const childRef = child;
                if (childRef) {
                    acc[child.key] = childRef.serialize();
                }
                return acc;
            }, {});
            if (this.attributes) {
                return { [this.name]: { ...serializedChildren, attributes: this.attributes } };
            }
            return { [this.name]: serializedChildren };
        },
        attributesToString() {
            if (this.attributes) {
                return Object.keys(this.attributes).map((key, value) => `${key.slice(2)}: ${value}`).join('\n');
            }
            return '';
        },
        onDoubleClick() {
            this.isEditing = true;
            this.$nextTick(() => {
                this.$refs.input.focus();
            });
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