<template>
    <div class="container">
        <div class="content">
            <h2>Help Center</h2>
            <div class="accordion-y-space">
                <accordion 
                header-content="How do I edit or remove my thread, opinion, or reply?"
                >
                    <template #accordioncontent>
                        <p>
                            A user cannot remove or edit his or her own thread, opinion, or reply once it has been submitted and published.
                            A posting will be hidden or removed by the moderator team or staff if it is in violation of our rules or terms 
                            of service.
                        </p>
                    </template>
                </accordion>
            </div>
            <div class="accordion-y-space">
                <accordion 
                header-content="What are the moderator and admin roles?"
                >
                    <template #accordioncontent>
                        <div>
                            <div>
                                <h3>Admin Roles</h3>
                                <p>
                                    Super Admin: The owner and master administrator of the site.
                                </p>
                                <p>
                                    Admin: An elevated administrative role.
                                </p>
                                <p>
                                    Staff: This is a future role for those employed to maintain the site.
                                </p>
                            </div>
                            <div>
                                <h3>Moderator Roles</h3>
                                <p>
                                    Platinum Moderator: Can freeze accounts and hide entire threads, along with the ability to perform functions of a silver or bronze mod.
                                </p>
                                <p>
                                    Silver Moderator: Can only hide opinions and replies.
                                </p>
                                <p>
                                    Bronze Moderator: Has the same abilities as the Silver moderator at this current time, just not as flashy.
                                </p>
                            </div>
                        </div>
                    </template>
                </accordion>
            </div>
            <div class="accordion-y-space">
                <accordion 
                header-content="How do I become a moderator?"
                >
                    <template #accordioncontent>
                        <p>
                           Those who show enthusiam, integrity, and are more active on the platform may receive a special invite to 
                           become a moderator. 
                        </p>
                    </template>
                </accordion>
            </div>
            <div class="accordion-y-space">
                <accordion 
                header-content="How do I block a user?"
                >
                    <template #accordioncontent>
                        <p>
                           Go to the user's profile and hit the "Block User" button. Those with admin roles cannot be blocked, and the block button 
                           will not be visible on their profiles.
                        </p>
                    </template>
                </accordion>
            </div>
            <div class="accordion-y-space">
                <accordion 
                header-content="I need help with something else."
                >
                    <template #accordioncontent>
                        <p>
                            Please reach out to <a href="mailto:help@ktown-portal.com">help@ktown-portal.com</a>
                        </p>
                    </template>
                </accordion>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import Accordion from '@/components/ui_elements/Accordion.vue';
</script>

<style lang="scss" scoped>
    .container{
        width:75%;
        padding:1rem;
        margin:2rem auto;
    }

    .content{
        background:#fff;
        border:1px solid #ccc;
        padding:1rem;

        h2{
            font-size:2rem;
            margin-bottom:1rem;
        }
    }

    .accordion-y-space{
        margin:2rem 0;
    }

    @media (max-width: 800px) {
        .container{
        width:100%;
        }
    }

</style>