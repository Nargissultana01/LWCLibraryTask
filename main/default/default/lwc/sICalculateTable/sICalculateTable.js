import { LightningElement, api, track } from 'lwc';
import getContacts from '@salesforce/apex/ContactList.getContacts';
import cancelObject from '@salesforce/apex/ContactList.cancelObject';
import saveRecord from '@salesforce/apex/ContactList.saveRecord';
//import { NavigationMixin } from 'lightning/navigation';
import { deleteRecord } from 'lightning/uiRecordApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';


export default class SICalculateTable extends LightningElement {

    @api recordId;
    @track recordAccId;
    @track contactList;
    saveData;
    renderTable = false;
    editrow=false;
    saveData=[];
    @track keyNo;
    @track cancelNoRow;
   
    //For add Row
    @track keyIndex=0;
    @track contactList=[
        {
            FirstName:'',
            LastName:'',
            Email:'',
            Principle__c:'',
            Rate__c:'',
            Time__c:'',
            SI__c:''

        }
    ];
    

  
// For Si
    principle;
    rate;
    time;
    @track simpleInterest;
    connectedCallback() {
       
        getContacts({ sourceAccountID: this.recordId })
       
            .then(result => {
                console.log(JSON.stringify(result));
                this.contactList = this.processData(result);
                console.log("ContactList:",JSON.stringify(this.contactList ));
                
                if (this.contactList.length === 0) {
                    this.renderTable = false;
                }
                else {
                    this.renderTable = true;
                }
            })
           
    }
    processData(data){
        let newData = [];
        data.forEach(currentItem => {
            currentItem.editrow = false;
            newData.push(currentItem);
        });
        return newData;
    }


    


   



   
 //SI Calculate
    valueChange(event){
        
        // this.keyNo=event.target.accessKey;
        // console.log('KeyNo:',this.keyNo);
        // console.log('Particular data of keyNo',JSON.stringify(this.contactList[this.keyNo]));

        this.contactList.forEach(currentItem => {
        
         if(event.currentTarget.dataset.recid === currentItem.Id)      
            {    
              if(event.target.name==='firstName'){
                   this.contactList[event.target.accessKey].FirstName=event.target.value;
                   console.log('First Name', this.contactList[event.target.accessKey].FirstName);
                   console.log('acctual value',JSON.stringify(this.contactList[event.target.accessKey]));
     
            
                }
        
                else if(event.target.name==='lastName'){
                    this.contactList[event.target.accessKey].LastName=event.target.value;
                    console.log('acctual value',JSON.stringify(this.contactList[event.target.accessKey]));
            
                }
                else if(event.target.name==='email'){
                    this.contactList[event.target.accessKey].Email=event.target.value;
                    console.log('acctual value',JSON.stringify(this.contactList[event.target.accessKey]));
            
                }
                else if(event.target.name==='principle'){
                    this.contactList[event.target.accessKey].Principle__c=event.target.value;
                    //Calculate SI
                    this.contactList[event.target.accessKey].SI__c=this.contactList[event.target.accessKey].Principle__c  * this.contactList[event.target.accessKey].Rate__c *  this.contactList[event.target.accessKey].Time__c/100;
                    console.log('acctual value',JSON.stringify(this.contactList[event.target.accessKey]));
                }
                else if(event.target.name==='rate'){
                    this.contactList[event.target.accessKey].Rate__c=event.target.value;
                    //Calculate SI
                    this.contactList[event.target.accessKey].SI__c=this.contactList[event.target.accessKey].Principle__c  * this.contactList[event.target.accessKey].Rate__c *  this.contactList[event.target.accessKey].Time__c/100;
                    console.log('acctual value',JSON.stringify(this.contactList[event.target.accessKey]));
            
                    
                }
                else if(event.target.name==='time'){
                    this.contactList[event.target.accessKey].Time__c=event.target.value;
                    console.log('Time', this.contactList[event.target.accessKey].Time__c);  
                    //Calculate SI
                    this.contactList[event.target.accessKey].SI__c=this.contactList[event.target.accessKey].Principle__c  * this.contactList[event.target.accessKey].Rate__c *  this.contactList[event.target.accessKey].Time__c/100;
                    console.log('AccessKey:',event.target.accessKey);
                    console.log('this.contactList[event.target.accessKey]:',JSON.stringify(this.contactList[event.target.accessKey]));
                    console.log('acctual value',JSON.stringify(this.contactList[event.target.accessKey]));
                }
                
                
            }
        });

     console.log(' Contact full list',JSON.stringify(this.contactList));

     
     this.simpleInterest=this.contactList[event.target.accessKey].SI__c;
     console.log('Simple:',this.simpleInterest);
    //  this.saveData=[];
    //  this.saveData.push(this.contactList[this.keyNo]);
    //  console.log('SaveData:',JSON.stringify(this.saveData));
    }
   
    


    //To delete the selected contact
    deleteContact(event) {
        
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
               
            });
    }

    editContact(event){
        this.contactList.forEach(currentItem => {
            console.log();
            if(event.currentTarget.dataset.recid === currentItem.Id){
                currentItem.editrow = true;
                console.log('currentItem',JSON.stringify(currentItem));
              
                
            }
        });
        console.log('Edit ContactList',JSON.stringify(this.contactList));
       
        console.log('recid:',event.currentTarget.dataset.recid);

       
      
    }


    //cancel method
    cancelParticulateRow(data,key){
        cancelObject({conId:data})
                .then(result=>{
                    console.log('Result:',JSON.stringify(result));
                    console.log('Access Key:',key);
                    // this.cancelData=result;
                    // console.log('Cancel Data:',this.cancelData);
                    this.contactList[key]=result;
                    console.log('Inside then.contactList[event.target.accessKey]:',JSON.stringify(this.contactList[key]));
       
                    
                })

    }




    cancel(event){
        
        this.contactList.forEach(currentItem => {
            if(event.currentTarget.dataset.recid === currentItem.Id){
                currentItem.editrow = false;
                this.cancelParticulateRow(event.currentTarget.dataset.recid,event.target.accessKey);
            }
        });
                // console.log('Access Key:',event.target.accessKey);
                // console.log('this.contactList[event.target.accessKey]:',JSON.stringify(this.contactList[event.target.accessKey]));
                // cancelObject({conId:event.currentTarget.dataset.recid})
                // .then(result=>{
                //     console.log('Result:',JSON.stringify(result));
                   
                //     this.cancelData=result;
                //     console.log('Cancel Data:',this.cancelData);
                //     this.contactList[event.target.accessKey]= this.cancelData;
                //     console.log('Inside then.contactList[event.target.accessKey]:',JSON.stringify(this.contactList[event.target.accessKey]));
       
                    
                // })
            
                // .catch(error=>{
                //     console.log(error);
                //     this.dispatchEvent(
                //         new ShowToastEvent({
                //             title: 'Error',
                //             message: error.message,
                //             variant: 'error',
                //         }),
                //     );

                // })

            
         
     
       // this.connectedCallback();
    }




    //Add new Row
    addRow(){
        
        
        this.keyIndex+1;
        this.contactList.push(
            {
                AccountId:this.recordId,
                FirstName:'',
                LastName:'',
                Email:'',
                Principle__c:'',
                Rate__c:'',
                Time__c:'',
                SI__c:'',
                
    
            }
            );
    

    }
    

    //Save The Record   
    SaveContact(){
            saveRecord({conRecordList:this.contactList})
        .then(result => {
            this.message=result;
            this.error=undefined;
            this.contactList.forEach(function(item){
                
                    item.FirstName='';
                    item.LastName='';
                    item.Email='';
                    item.Principle__c='';
                    item.Rate__c='';
                    item.Time__c='';
                    item.SI__c='';
                    
        
                });
                


            if(this.message!==undefined){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Saved record',
                    variant: 'success',
                }),
            );
            }
            this.connectedCallback();
        
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
            
        });
    }





    //save particular record
     saving(event){
         
            
       
    
        this.keyNo=event.target.accessKey;
        console.log('KeyNo:',this.keyNo);
        console.log('Particular data of keyNo',JSON.stringify(this.contactList[this.keyNo]));
        this.saveData=[];
        this.saveData.push(this.contactList[this.keyNo]);
        console.log('SaveData:',JSON.stringify(this.saveData));

        saveRecord({conRecordList:this.saveData})
        .then(result => {
            this.message=result;
            this.error=undefined;
            this.contactList.forEach(function(item){
                
                    item.FirstName='';
                    item.LastName='';
                    item.Email='';
                    item.Principle__c='';
                    item.Rate__c='';
                    item.Time__c='';
                    item.SI__c='';
                    
                });
                


            if(this.message!==undefined){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Saved record',
                    variant: 'success',
                }),
            );
            }
            this.connectedCallback();
        
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
            
        });
    }

    
}

