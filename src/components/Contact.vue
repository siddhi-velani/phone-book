<template>

  <div class="contact">
    <div>
        <span class="font-weight-bold mr-2">{{fullName}}</span> 
        <b-icon-pencil-fill @click="editContact" class="mr-2" variant="primary"></b-icon-pencil-fill>
        <b-icon-trash-fill @click="deleteContact" variant="danger"></b-icon-trash-fill>

        <br />
        <span class="font-weight-normal">{{contact.phone}}</span>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Contact',
    props: {
        contact: {
            type: Object
        }
    },
    data(){
        return{
        }
    },
    computed: {
        fullName(){
            return this.contact.firstName + ' ' + this.contact.lastName
        }
    },
    methods: {
        editContact(){
            this.$emit('edit-contact', this.contact)
            this.edit = false           
        },

        deleteContact(){
            this.$emit('delete-contact', this.contact.id);
        }
    }
}
</script>

<style>

.contact {
    width: 50vw;
    padding: 0.5rem;
    border: solid 1px black;  
    align-items: center;
    margin: 0.5rem auto;
}

form {
    justify-content: center;}

</style>