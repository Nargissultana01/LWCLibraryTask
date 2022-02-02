

import { LightningElement,api,track,wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';
import updateContacts from '@salesforce/apex/ContactList.updateContacts';
import FIRSTNAME from '@salesforce/schema/Contact.FirstName';
import LASTNAME from '@salesforce/schema/Contact.LastName';
import EMAIL from '@salesforce/schema/Contact.Email';
import PRINCIPLE from '@salesforce/schema/Contact.Principle__c';
import RATE from '@salesforce/schema/Contact.Rate__c';
import TIME from '@salesforce/schema/Contact.Time__c';
import getContacts from '@salesforce/apex/ContactList.getContacts';

import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const actions = [
    { label: 'Edit', name: 'Edit', iconName: 'utility:edit' },
    { label: 'Delete', name: 'Delete' },
];

const columns=[
    {
    label: 'First Name', 
    fieldName: 'FirstName',
    editable: true
},
{
    label: 'Last Name', 
    fieldName: 'LastName',
    editable: true
},
{
    label: 'Email Id', 
    fieldName: 'Email',
    editable: true
},
{
    label: 'Principle', 
    fieldName: 'Principle__c',
    editable: true
},
{
    label: 'Rate', 
    fieldName: 'Rate__c',
    editable: true
},
{
    label: 'Time', 
    fieldName: 'Time__c',
    editable: true
},
{
    label: 'SI', 
    fieldName: 'SI__c'
},

 {
    label: 'Actions',
    type: 'action',
    typeAttributes: { rowActions: actions, menuAlignment: 'right' }
}


]

export default class ContactSICalculate extends LightningElement {
    @track toggleSaveLabel="Save";
    columns = columns;
    @track conObj;
    @api recordId;
    draftValues = [];
    @track SIrecord={
        "Principle":'',
        "Rate":'',
        "Time":'',
        "SI":''
    }
    Simple_Interest=[];
 
    connectedCallback(){
        getContacts({sourceAccountID : this.recordId}).then(result=>{
           console.log(JSON.stringify(result));
            this.conObj = result;
            console.log(JSON.stringify(this.conObj));

            for(var i=0;i<result.lenght;i++){
                this.SIrecord.Principle=result[i].Principle__c;
                this.SIrecord.Rate=result[i].Rate__c;
                this.SIrecord.Time=result[i].Time__c;

               // this.SIrecord.SI=result[i].Principle__c * result[i].Rate__c * result[i].Time__c/100;
            }
            //this.Simple_Interest=this.SIrecord.SI;

        })
        .catch(error=>{
            console.log(this.error);
        })
        
    }






    async handleSave(event) {
        const updatedFields = event.detail.draftValues;
        
        // Prepare the record IDs for getRecordNotifyChange()
        const notifyChangeIds = updatedFields.map(row => { return { "recordId": row.Id } });
    
        try {
            // Pass edited fields to the updateContacts Apex controller
            const result = await updateContacts({data: updatedFields});
            console.log(JSON.stringify("Apex update result: "+ result));
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contact updated',
                    variant: 'success'
                })
            );
    
            // Refresh LDS cache and wires
            getRecordNotifyChange(notifyChangeIds);
    
            // Display fresh data in the datatable
            refreshApex(this.contact).then(() => {
                // Clear all draft values in the datatable
                this.draftValues = [];
            });
       } catch(error) {
               this.dispatchEvent(
                   new ShowToastEvent({
                       title: 'Error updating or refreshing records',
                       message: error.body.message,
                       variant: 'error'
                   })
             );
        };
    }
    

    /*
    handleSave(event) {
        this.draftValues = event.detail.draftValues;
        const inputsItems = this.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
 
        const notifyChangeIds = inputsItems.map(row => { return { "recordId": row.Id } });
       
        const promises = inputsItems.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(res => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Records Updated Successfully!!',
                    variant: 'success'
                })
            );
            this.draftValues = [];
            return this.refresh();
        }).catch(error => {
            console.log(error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'An Error Occured!!',
                    variant: 'error'
                   
                })
            );
        }).finally(() => {
            this.draftValues = [];
        });
    }
 
   
    async refresh() {
        await refreshApex(this.conObj);
    }

*/





































    /*
    draftValues = [];
    columns=columns;

    @track toggleSaveLabel="Save";
    @api recordId;
    @track Conlist;
    connectedCallback(){
        getContacts({sourceAccountID : this.recordId}).then(result=>{
           console.log(this.result);
            this.Conlist = result;
        })
        
    }

    async handleSave(event) {
        const updatedFields = event.detail.draftValues;
        
        // Prepare the record IDs for getRecordNotifyChange()
        const notifyChangeIds = updatedFields.map(row => { return { "recordId": row.Id } });
    
        try {
            // Pass edited fields to the updateContacts Apex controller
            const result = await updateContacts({data: updatedFields});
            console.log(JSON.stringify("Apex update result: "+ result));
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contact updated',
                    variant: 'success'
                })
            );
    
            // Refresh LDS cache and wires
            getRecordNotifyChange(notifyChangeIds);
    
            // Display fresh data in the datatable
            refreshApex(this.contact).then(() => {
                // Clear all draft values in the datatable
                this.draftValues = [];
            });
       } catch(error) {
               this.dispatchEvent(
                   new ShowToastEvent({
                       title: 'Error updating or refreshing records',
                       message: error.body.message,
                       variant: 'error'
                   })
             );
        };
    }
*/    
}







































/*
import { LightningElement, api, track } from 'lwc';
import getContacts from '@salesforce/apex/ContactList.getContacts';
import { NavigationMixin } from 'lightning/navigation';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';


export default class ContactSICalculate extends NavigationMixin(LightningElement) {

    @api recordId;
    isloading;
    @track contactList;
    renderTable = false;

    connectedCallback() {
        this.isLoading = true;
        getContacts({ sourceAccount: this.recordId })
            .then(result => {
                this.contactList = result;
                if (this.contactList.length === 0) {
                    this.renderTable = false;
                }
                else {
                    this.renderTable = true;
                }
            })
            this.isLoading = false;
    }

    //To navigate to record edit page for selected record
    navigateToRecordEditPage(event) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.currentTarget.dataset.recid,
                objectApiName: 'Contact',
                actionName: 'edit'
            }
        });
    }

    //To delete the selected contact
    deleteContact(event) {
        this.isLoading = true;
        deleteRecord(event.currentTarget.dataset.recid)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record Is Deleted',
                        variant: 'success',
                    }),
                );
                this.connectedCallback();
                this.isLoading = false;
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.message,
                        variant: 'error',
                    }),
                );
                this.connectedCallback();
                this.isLoading = false;
            });
    }

     // To navigate to contact new functionality aura component
     navigateToNewPage() {
        const defaultValues = encodeDefaultFieldValues({
            AccountId: this.recordId

        });
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Contact',
                actionName: 'new'
            },
            state: {
                defaultFieldValues: defaultValues
            }
        });
    }
}

*/




















































/*
    handleSave(event) {
        this.draftValues = event.detail.draftValues;
        const inputsItems = this.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
 
       
        const promises = inputsItems.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(res => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Records Updated Successfully!!',
                    variant: 'success'
                })
            );
            this.draftValues = [];
            return this.refresh();
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'An Error Occured!!',
                    variant: 'error'
                })
            );
        }).finally(() => {
            this.draftValues = [];
        });
    }
 
   
    async refresh() {
        await refreshApex(this.accObj);
    }

    
    async handleSave(event) {

        const updatedFields = event.detail.draftValues;
    
        // Prepare the record IDs for getRecordNotifyChange()
        const notifyChangeIds = updatedFields.map(row => { return { "recordId": row.Id } });
    
        try {
            // Pass edited fields to the updateContacts Apex controller
            const result = await updateContacts({data: updatedFields});
            console.log(JSON.stringify("Apex update result: "+ result));
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contact updated',
                    variant: 'success'
                })
            );
    
            // Refresh LDS cache and wires
            getRecordNotifyChange(notifyChangeIds);
    
            // Display fresh data in the datatable
            refreshApex(this.contact).then(() => {
                // Clear all draft values in the datatable
                this.draftValues = [];
            });
       } catch(error) {
               this.dispatchEvent(
                   new ShowToastEvent({
                       title: 'Error updating or refreshing records',
                       message: error.body.message,
                       variant: 'error'
                   })
             );
        };

    }


    //calculate SI

   /* function simple_Interest() {
        var p,t,r,si;
        p = document.getElementById ("first").value;
        t = document.getElementById ("second").value;
        r = document.getElementById ("third").value;
        si = parseInt((p*t*r)/100 );
    }
    */



/*
    getSelectedName(event) {
        const selectedRows = event.detail.selectedRows;
        this.selectedAccountlist = [];
        for (var i = 0; i < selectedRows.length; i++){
            this.selectedAccountlist.push(selectedRows[i].Id);
        }
        }
        


        @api
    handleRowAction(event) {
        var action = event.detail.action;
        var row = event.detail.row.Id;
        switch (action.name) {
            case 'Edit':
                         /*Write Your Code IF Edit
                break;
            case 'Delete':
                    /*Write Your Code IF Delete

             break;
        }
    }

    */


