import "@/assets/main.css"

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

{/* <font-awesome-icon icon="fa-solid fa-cloud-arrow-down" /> */}
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleInfo, faUserTie, faPlusCircle, faCloudArrowDown } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faFileCode, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
    faCircleInfo, faUserTie, faLinkedin, faEnvelope, faGithub,
    faFileCode, faTrashCan, faCloudArrowDown, faPlusCircle,
);

const app = createApp(App)

app.use(createPinia())

app.component("font-awesome-icon", FontAwesomeIcon).mount('#app')
