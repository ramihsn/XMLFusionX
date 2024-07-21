<template>
    <input type="file" id="fileInput" class="file-input" @change="handleFileChange" ref="fileInput" />
    <div class="upload-container" v-if="counter === 0">
        <h2>Upload Your File</h2>
        <div class="upload-box" @drop.prevent="handleDrop" @dragover.prevent>
            <div class="upload-icon" @click="triggerFileInput">
                <font-awesome-icon class="svg-el" icon="fa-regular fa-file-code" size="5x" style="color: #63E6BE;" />
            </div>
            <p @click="triggerFileInput">Drop XML here</p>
            <div class="or-divider">
                <span>OR</span>
            </div>
            <button class="upload-button" @click="triggerFileInput">{{ message }}</button>
        </div>
    </div>
    <div class="add-file" v-else @click="triggerFileInput">
        <font-awesome-icon icon="fa-solid fa-circle-plus" size="4x" />
    </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
   name: 'FileUpload',
   emits: ['file-upload'],
   props: {
       counter: {
           type: Number,
           default: 0
       }
   },
   setup(props) {
       const defaultMessage = 'UPLOAD XML TO START';
       const addMessage = 'UPLOAD ANOTHER XML';
       const message = ref(props.counter == 0 ? defaultMessage : addMessage);

       const fileInput = ref(null);

       const triggerFileInput = () => {
           if (fileInput.value) {
               fileInput.value.click();
           }
       };

       watch(() => props.counter, (newVal) => {
           console.log('Counter changed:', newVal);
           message.value = newVal == 0 ? defaultMessage : addMessage;
       });

       return {
           message,
           fileInput,
           triggerFileInput,
       };
   },
   methods: {
       handleFileChange(event) {
           const files = event.target.files;
           this.processFiles(files);
       },
       handleDrop(event) {
           const files = event.dataTransfer.files;
           this.processFiles(files);
       },
       processFiles(files) {
           this.$emit('file-upload', [...files]);
       }
   }
}
</script>
  
<style scoped>
.upload-container {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 400px;
}

.upload-container h2 {
    margin-bottom: 20px;
}

.upload-box {
    border: 2px dashed #63E6BE;
    border-radius: 10px;
    padding: 20px;
    cursor: pointer;
    position: relative;
}

.file-input {
    display: none;
}

.upload-icon {
    margin-bottom: 10px;
}

.upload-icon svg {
    color: #63E6BE;
}

p {
    margin: 10px 0;
    font-size: 16px;
    color: #333;
}

.or-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 0;
}

.or-divider::before,
.or-divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ddd;
    margin: 0 10px;
}

.or-divider span {
    font-size: 14px;
    color: #999;
}

.upload-button {
    background-color: #63E6BE;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}

.upload-button:hover {
    background-color: #5ad1a9;
}

.add-file {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #63E6BE;
    color: #fff;
    border: none;
    border-radius: 50%;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s;
    /* z-index: 1000; */
}
</style>