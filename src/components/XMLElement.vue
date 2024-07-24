<template>
    <div class="container" >
        <!-- ensure the right amount of indentation -->
        <div class="box" v-for="i in Array.from(Array(indentation).keys())" :key="i"></div>
        <div class="icon" v-if="children.length > 0" @click="toggle">
            <font-awesome-icon icon="fa-solid fa-caret-down" :class="{'fa-rotate-270': !isExpanded}" />
        </div>
        <div v-else style="margin-right: 20px;"></div>

        <div class="name"><strong>{{ name }} :</strong></div>

        <div class="value" v-if="value !== null" @dblclick="isEditing=true">
            <div
                v-if="!isEditing"
                title="Double click to edit"
            >
                {{ value }}
            </div>
            <input
                v-else
                type="text"
                v-model="value"
                @blur="isEditing=false"
                @keyup.enter="isEditing=false"
                @keyup.escape="abortEditing"
            />
        </div>
    </div>
    <div class="children" v-if="value === null">
        <div v-show="isExpanded" v-for="(child, idx) in children" :key="idx">
            <XMLElement ref="child" :name="child.key" :values="child.values" :indentation="indentation + 1" />
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';

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
    },
    setup(props) {
        const children = ref([]);

        let originalValue = null;
        let lastValue = null;
        const value = ref(null);

        const isExpanded = ref(true);
        const isEditing = ref(false);
        const editHover = ref(false);

        if (typeof props.values === 'string' || typeof props.values === 'number') {
            value.value = (typeof props.values === 'number' && props.values.toString().length > 15)
                ? props.values.toLocaleString('fullwide', { useGrouping: false })
                : props.values;

            if (originalValue === null) {
                originalValue = value.value
                lastValue = value.value;
            } else {
                lastValue = value.value;
            }
        } else {
            children.value = Object.keys(props.values).map(key => ({ key, values: props.values[key] }));
        }

        const toggle = () => {
            isExpanded.value = !isExpanded.value;
        };

        const abortEditing = () => {
            value.value = lastValue;
            isEditing.value = false;
        }

        return {
            value, children, isExpanded, isEditing,
            toggle, editHover, abortEditing, // serialize,
        };
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