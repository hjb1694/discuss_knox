<template>
    <div>
        <div class="container">
            <form class="edit-profile-form">
                <v-select label="Occupation" :options="occupationOptions"/>


            </form>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const occupationOptions = [
        'Finance', 
        'Healthcare', 
        'Technology', 
        'Food Service', 
        'Construction', 
        'Maintenance',
        'Education', 
        'Childcare', 
        'Student', 
        'Government', 
        'Public Safety + Security', 
        'Retail'
    ];
</script>

<style lang="scss" scoped>

    .container{
        width:60%;
        margin:2rem auto;
        padding:1rem;
    }

    .edit-profile-form{
        background:#fff;
        box-shadow: 0 0 .25rem rgba(0,0,0,.24);
        padding:2rem;
        font-size:1.6rem;
    }


    @media (max-width: 750px) {

        .container{
            width:100%;
        }

    }
</style>