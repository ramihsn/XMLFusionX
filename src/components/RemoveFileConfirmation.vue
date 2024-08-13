<template>
    <div  class="backdrop" @click.self="() => closeRemoveFileConfirmation(false)">
        <div class="module" >
            <div class="container">
                <h2>Confirm File Removal</h2>
                <p>Are you sure you want to remove the file <strong>{{ fileName }}</strong>?</p>
                <div class="modal-actions">
                    <button class="btn btn-confirm" @click="() => closeRemoveFileConfirmation(true)">Yes, Remove</button>
                    <button class="btn btn-cancel" @click="() => closeRemoveFileConfirmation(false)">Cancel</button>
                </div>
                <!-- <div class="row"><strong>Are you sure that you want to remove the following file?</strong></div>
                <div class="row">{{ file_name }}</div>
                <div class="row buttons-container">
                    <button>Confirm</button>
                    <button>Cancel</button>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "RemoveFileConfirmation",
    emits: ['closeRemoveFileConfirmation'],
    props: {
        fileName: String,
    },
    methods: {
        /**
         * @param {Boolean} removeFile - should the file be removed
         */
        closeRemoveFileConfirmation(removeFile) {
            this.$emit('closeRemoveFileConfirmation', removeFile)
        },
    }
}
</script>

<style scoped>
.modal h2 {
    margin-bottom: 10px;
}

.modal p {
    margin-bottom: 20px;
}

.modal-actions {
    display: flex;
    justify-content: space-between;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.btn-confirm {
    background-color: #e74c3c;
    color: white;
}

.btn-cancel {
    background-color: #95a5a6;
    color: white;
}

.btn:hover {
    opacity: 0.9;
}
</style>