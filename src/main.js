import "@/assets/main.css"

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleInfo, faUserTie, faCloudArrowDown, faCaretDown, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faFileCode, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
    faCircleInfo, faUserTie, faLinkedin, faEnvelope, faGithub,
    faFileCode, faTrashCan, faCloudArrowDown,
    faCaretDown, faSpinner,
);

const app = createApp(App)

app.use(createPinia())

app.component("font-awesome-icon", FontAwesomeIcon).mount('#app')
