<template>
    <div>
        <h2>Phone Book</h2>
        <br />
        <div v-if="isLoading" >
            <b-spinner label="Loading Phone Book..."></b-spinner>
            <br />
            <label>Loading Phone Book...</label>
        </div>
        <div v-else>
            <b-row style="width:50vw;margin: auto">
                <b-col class="filter">
                    <b-form-input v-model="filterName" placeholder="Search by Name"></b-form-input>
                </b-col>
                <b-col class="filter">
                    <b-form-input type="number" v-model="filterPhone" placeholder="Search by Phone number"></b-form-input>
                </b-col>
                <b-button 
                    variant="success" 
                    v-b-modal.addDialog 
                    @click="showModal = true"
                >Add</b-button>
            </b-row>

            <b-modal 
                id="addDialog" 
                :title="dialogLabel"
                v-model="showModal"
                ok-title='Save'
                @ok='saveContact'
                @cancel='resetForm'
                @close='resetForm'
                >
                <b-form>
                    
                    <b-row>
                        
                        <b-col>
                            <b-form-input 
                                placeholder="First Name"
                                v-model="form.firstName"
                                class="mb-2"
                            ></b-form-input>
                            <label v-show="fnameError" class="red">First Name is Mandatory</label>
                        </b-col>

                        <b-col>
                            <b-form-input 
                                placeholder="Last Name"
                                v-model="form.lastName"
                                class="mb-2"
                            ></b-form-input>
                            <label v-show="lnameError" class="red">Last Name is Mandatory</label>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-form-input 
                                type="number"
                                placeholder="Phone"
                                v-model="form.phone"
                                class="mb-2"
                            ></b-form-input>
                            <label v-show="phoneError" class="red">Phone number is Mandatory</label>
                        </b-col>

                    </b-row>

                    
                </b-form >
            </b-modal>
            
            <template v-for="contact in filterList">
                <Contact 
                    :key="contact.id" 
                    :contact="contact" 
                    @edit-contact="editContact"
                    @delete-contact="deleteContact"/>
            </template>
        </div>
    </div>
</template>

<script>
import Contact from './Contact.vue'

import APIService from '../services/APIService';

const apiService = new APIService();

export default {  
    components: { Contact },
    name: 'ContactList',
    data(){
        return {
            contactList: [],
            filterList: [],
            isAdd: true,
            isLoading: true,
            showModal: false,
            form:{
                firstName: '',
                lastname: '',
                phone: null
            },
            filterName: '',
            filterPhone: null,
            fnameError: false,
            lnameError: false,
            phoneError: false
        }
    },
    mounted(){
        this.getContacts();
    },
    watch: {
        filterName(newVal){
            if(newVal){
                this.filterPhone = null;    // only support one filter at a time
                this.filterList = this.contactList.filter((contact) => {
                    const fIndex = contact.firstName.toLowerCase().indexOf(newVal.toLowerCase());
                    const lIndex = contact.lastName.toLowerCase().indexOf(newVal.toLowerCase());
                   return  fIndex >= 0 || lIndex >= 0;
                });
            }
            else{
                this.filterList = [...this.contactList];
            }
        },

        filterPhone(newVal){
            if(newVal){
                this.filterName = '';   // only support one filter at a time
                this.filterList = this.contactList.filter((contact) => {
                    const numIndex = contact.phone.indexOf(newVal);
                   return  numIndex >= 0 ;
                });
            }
            else{
                this.filterList = [...this.contactList];
            }
        },

        contactList(newVal){
            this.filterList = [...newVal]
        }
    },
    computed: {
        dialogLabel(){
            return this.isAdd ? 'Add Contact' : 'Edit Contact';
        }
    },
    methods:{

        async getContacts(){
            try{
                const response = await apiService.getContactList();
                this.contactList = response;
                this.filterList = [...this.contactList];
                this.isLoading = false;
            }
            catch(error){
                this.isLoading = false;
                console.log(error)
            }
        },

        saveContact(e){
            this.fnameError = this.form.firstName ? false : true;
            this.lnameError = this.form.lastName ? false : true;
            this.phoneError = this.form.phone ? false : true;
            
            if(this.fnameError || this.lnameError || this.phoneError) {
                e.preventDefault();
            }
            else{
                if(this.isAdd){
                    const contact = this.form;
                    this.contactList.push(contact)
                }
                else{
                    const contact = this.form;
                    const index = this.contactList.findIndex(cont => cont.id === contact.id)
                    this.contactList[index] = contact;
                }
                this.resetForm();
            }
            
        },

        editContact(contact){
            this.form = {...contact};
            this.isAdd = false;
            this.showModal = true;            
        },

        deleteContact(id){
            this.contactList = this.contactList.filter(contact => contact.id != id);
        },


        resetForm(){
            this.form = {
                firstName: '',
                lastname: '',
                phone: null
            };
            this.isAdd = true;
            this.showModal = false;
        }
    }
}
</script>

<style scoped>
 .filter {
     padding-left: 0px;
 }
 .red {
     color: red;
 }
</style>