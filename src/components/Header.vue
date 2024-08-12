<template>
    <teleport to=".developer-info" v-if="showDevelopInfo">
        <DeveloperInfo @closeDeveloperInfo="onToggleDevelopInfo" />
    </teleport>

    <div class="header">
        <div class="logo">
            <div class="logo-container">
                <img src="@/assets/xml-icon.png" alt="Logo">
                <span>{{ tag }}</span>
            </div>
        </div>
        <div class="author">
            <span>This tool was developed by:</span>
            <span><strong>{{ author }}</strong></span>
        </div>
        <div class="about">
            <div class="tooltip" @click="onToggleDevelopInfo">
                <span>
                    <font-awesome-icon :icon="['fas', 'circle-info']" class="slow-spin" flip style="color: #63E6BE;" size="3x" />
                </span>
                <span class="tooltiptext">For more info about the developer, click me</span>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import DeveloperInfo from './DeveloperInfo.vue';

export default {
    name: 'Header',
    components: {
        DeveloperInfo
    },
    setup () {
        const showDevelopInfo = ref(false);
        const tag = ref('loading...');

        const onToggleDevelopInfo = () => {
            showDevelopInfo.value = !showDevelopInfo.value;
        }

        return {
            author: 'Rami Hassan',
            onToggleDevelopInfo,
            showDevelopInfo,
            tag,
        }
    },
    data() {
        return {
            visible: false
        }
    },
    showTooltip() {
        this.$refs.tooltip.showTooltip();
    },
    hideTooltip() {
        this.$refs.tooltip.hideTooltip();
    },
    methods: {
        async fetchLatestTag () {
            try {
                const response = await fetch('https://api.github.com/repos/ramihsn/XMLFusionX/tags');

                const data = await response.json();
                if (data.length > 0) {
                    this.tag = data[0].name;
                } else {
                    this.tag = 'No tags found';
                }
            } catch (error) {
                console.error('Error fetching the latest tag:', error);
                this.tag = 'Error fetching tag';
            }
        },
    },
    mounted() {
        this.fetchLatestTag();
    },
}
</script>

<style scoped>
.header {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    align-items: center;
    height: 10vh; /* Adjust as needed */
    padding: 0 1rem;
    border-bottom: 1px solid black;
    background-color: #f0f0f0; /* Optional: to match your design */
}

.logo {
  display: flex;
  align-items: center;
}

.logo-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.slow-spin {
  animation: fa-flip 2.5s infinite alternate;
}

.logo img {
  max-height: 70px;
}

.author {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 2rem;
  /* font-weight: bold; */
}

.author span {
    margin-right: 30px;
}

.about {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    text-align: right;
}

.icon-container {
    cursor: pointer;
    background-color: red;
}

/* ToolTip */
.tooltip {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.tooltip .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
  
    /* Position the tooltip */
    position: absolute;
    z-index: 1;
    top: 100%;
    left: 50%;
    margin-top: 5px;
    margin-left: -100px;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>