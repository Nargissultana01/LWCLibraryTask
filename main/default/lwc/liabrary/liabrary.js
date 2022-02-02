
import { LightningElement,track } from 'lwc';
import getAllbook from '@salesforce/apex/Liabrary.getAllbook';
import allBookRecordToShow from '@salesforce/apex/Liabrary.allBookRecordToShow';
import getreturnSelectedBook  from '@salesforce/apex/Liabrary.getreturnSelectedBook';
import SaveBookRecord from '@salesforce/apex/Liabrary.saveBookRecord';
//import createBookCopy from '@salesforce/apex/Liabrary.createBookCopy'
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import bookname from '@salesforce/schema/Book__c.Name';
import isbnNumber from '@salesforce/schema/Book__c.ISBN_Number__c';
import price from '@salesforce/schema/Book__c.Price__c';
import author from '@salesforce/schema/Book__c.Author__c';
import copies from '@salesforce/schema/Book_Copy__c.Book__c';


export default class Liabary extends LightningElement {
   @track getBookRecord={
    Name:bookname,
    ISBN_Number__c:isbnNumber,
    Price__c:price,
    Author__c:author
   };
   @track numberofbooks;
name;
   @track BookList;
   @track isbnNumber;

   @track booknameEx;
   editrow=false;
   renderTable=true;

   

   connectedCallback(){
    allBookRecordToShow()
    .then(result=>{
        this.BookList=result;

    })
   }




    handlechange(event){
        if(event.target.name==='bookName'){
            this.getBookRecord.Name=event.target.value;
        }
        else if(event.target.name==='isbn'){
            this.getBookRecord.ISBN_Number__c=event.target.value;
            this.isbnNumber=event.target.value;
            getAllbook({isbnnumber:this.isbnNumber})
            .then(result => {
                console.log('Selected Record are:',JSON.stringify(result));

                this.BookList=result;
                
                console.log('Book List',JSON.stringify(this.BookList));
               
            })

            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.message,
                        variant: 'error',
                    }),
                );
            });
        }
        else if(event.target.name==='price'){
            this.getBookRecord.Price__c=event.target.value;
        }
        else if(event.target.name==='author'){
            this.getBookRecord.Author__c=event.target.value;
        }
        else if(event.target.name==='numberofbooks'){
            this.numberofbooks=event.target.value;
        }
        console.log('book Name:',this.getBookRecord.Name);
        console.log('Number Of Books:',this.numberofbooks);
        console.log('ISBN NUMBER:',this.isbnNumber);
    }

    handleClick(){
        SaveBookRecord({bookRecord : this.getBookRecord ,isbnnumber:this.getBookRecord.ISBN_Number__c , numberOfCopies:this.numberofbooks})

        
        .then((result) => {
            console.log('Record Created:', JSON.stringify(result));
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Copies Of '+this.getBookRecord.Name+' created Successfully',
                    variant: 'success',
                }),
            );  
            this.getBookRecord={
                Name:'',
                ISBN_Number__c:'',
                Price__c:'',
                Author__c:''
               };
               this.numberofbooks='';
               this.connectedCallback();
        })
        .catch(error => {
            console.log('Error:',error.message);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error',
                }),
            );
           
        });

        this.connectedCallback();
    }





    cancelbutton(){
        this.getBookRecord={
            Name:'',
            ISBN_Number__c:'',
            Price__c:'',
            Author__c:''
           };
           this.numberofbooks='';
           this.connectedCallback();

    }


    selecthandel(event){
        console.log(event.target.accessKey);
        let rowId = event.currentTarget.dataset.recid
        console.log('record Id2',rowId);
       
      // console.log('Particular Record',JSON.stringify(this.BookList[event.target.accessKey]));
       //this.getBookRecord=this.BookList[event.target.accessKey];
       getreturnSelectedBook({bookRecordId:event.currentTarget.dataset.recid})
           .then(result=>{
               console.log('Particular Record',result);
            this.getBookRecord=result;
           })
      
       
       console.log('Particular book',JSON.stringify(this.getBookRecord));
        console.log('record Id',event.currentTarget.dataset.recid);
     

    }


}
   