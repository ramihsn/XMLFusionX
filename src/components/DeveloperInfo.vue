<template>
    <div class="backdrop" @click.self="closeDeveloperInfo" >
        <div class="module" >
            <div class="developer-info">
                <div class="developer-info-content">
                    <table>
                        <tr> <!-- First row -->
                            <td colspan="3">
                                <div class="icon-text header">
                                    <font-awesome-icon icon="fa-solid fa-user-tie" size="2x" />
                                    <span class="content header-content"><strong>Rami Hassan</strong></span>
                                </div>
                            </td>
                        </tr>
                        <tr> <!-- Second row (spacer) -->
                            <td colspan="3" style="height: 200px;">
                                <div class="about-text">
                                    <p>Hello, I am Rami Hassan,</p>
                                    <p>A passionate software developer with over {{ experience }} years of experience.</p>
                                    <p>I specialize in Python and have extensive knowledge in developing automated tools and infrastructure.</p>
                                    <p>My expertise includes working with various communication protocols and creating efficient and robust solutions.</p>
                                    <p>I'm always eager to learn new technologies and take on new challenges.</p>
                                    <p>You can contact with any of the following platforms 😉.</p>
                                </div>
                            </td>
                        </tr>
                        <tr> <!-- Third row -->
                            <td colspan="2">
                                <div class="icon-text">
                                    <font-awesome-icon icon="fa-brands fa-linkedin" size="2x" style="color: #126BC4;" />
                                    <a class="content" href="https://www.linkedin.com/in/rami-hassan" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                                </div>
                            </td>
                            <td>
                                <div class="icon-text">
                                    <font-awesome-icon icon="fa-brands fa-github"  size="2x" />
                                    <a class="content" href="https://github.com/ramihsn" target="_blank" rel="noopener noreferrer">GitHub</a>
                                </div>
                            </td>
                        </tr>
                        <tr> <!-- Fourth row -->
                            <td colspan="3">
                                <div class="icon-text header">
                                    <font-awesome-icon icon="fa-regular fa-envelope" size="2x" style="color: #ce3d30;" />
                                    <a class="content" href="mailto:hsn.rami@gmail.com">hsn.rami@gmail.com</a>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DeveloperInfo',
    emits: ['closeDeveloperInfo'],
    setup(props, { emit }) {
        const closeDeveloperInfo = () => {
            emit('closeDeveloperInfo');
        }

        return {
            closeDeveloperInfo,
        }
    },
    data() {
        const startingYear = 2016;
        const currentYear = new Date().getFullYear();
        const experience = currentYear - startingYear;

        return {
            experience,
        }
    },
}
</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    border: 1px solid black;
    padding: 8px;
    text-align: left;
    vertical-align: top;
}

.icon-text {
    display: flex;
    align-items: center;
}

.icon {
    width: 24px;
    height: 24px;
    background-color: #ccc; /* Placeholder for icon */
    margin-right: 8px;
    border-radius: 50%; /* Optional for circular icon */
}

.content {
    padding-left: 15px;
}

.header-content {
    font-size: 1.5rem;
}

.header {
    width: 100%;
    justify-content: center;
}

</style>