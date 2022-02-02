import { LightningElement,track,api } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import searchBookName from '@salesforce/apex/Liabrary.searchBookName';
import allBookRecordToShow from '@salesforce/apex/Liabrary.allBookRecordToShow'

export default class LiabrarySearchBook extends LightningElement {
    @track BookList;
    @track getrecord;
    buttonLabelName;
    renderTable=true;
    @track readerVisible = false;

    //passing id in liabraryBookReader
    @api bookrecordId;
    @api tab ;


    //For pagination
 @track page = 1;
 @track startingRecord = 1; 
    @track endingRecord = 0; 
    @track pageSize; 
    @track totalRecountCount = 0; 
    @track totalPage = 0;
    @track item = [];



    connectedCallback() {
        allBookRecordToShow()
             .then(result=>{
                console.log('Result:',result);
                this.BookList=result;
                console.log('BookList:',this.BookList);
             })
    
    }

    //for pageSize combobox
    get options() {
        return [
            { label: '5', value: '5' },
            { label: '10', value: '10' },
            { label: '15', value: '15' },
        ];
    }


    
    hanldeProgressValueChange(event) {
      this.tab = event.detail;
      console.log('tab:', this.tab);
      const selectedEvent = new CustomEvent("progressvaluechange", {
        detail: this.tab
      });
  
      this.dispatchEvent(selectedEvent);
    }

    comboChange(event) {
        this.value = event.detail.value;
        this.pageSize=event.detail.value;
        console.log('page size:',this.pageSize);
    }

    findButtonLabel(event){
        console.log('Label:',event.target.label);
        this.buttonLabelName=event.target.label;
    }
    


    

    handleChange(event){
        console.log('buttonLabelName:',this.buttonLabelName);
        this.getrecord=event.target.value;
        console.log('getrecord:',this.getrecord);
        searchBookName({searchValue:this.getrecord ,buttonLabelName:this.buttonLabelName})
        .then(result=>{
            console.log('Result by Name:',result);
        


         //For pagination Start
            this.item = result;
            this.totalRecountCount = result.length; 
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);

            this.BookList = this.item.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;
        })
        .catch((error) => {  
            this.error = error;   
            console.log('Error',error); 
            });
    }


    //For pagination start

    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
    }
    
    
    nextHandler() {
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);            
        }             
    }
    
    
    displayRecordPerPage(page){
        
        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);
    
        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 
    
        this.BookList = this.item.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
        
    
    }
    
    
    get disablePrev(){
        if(this.page===1){
    return true;
        }else{
        return false;
        }
    }
    
    
    get disableNext(){
        if(this.page===this.totalPage||this.totalPage===0){
        return true;
    
        }
        else{
        return false;
        }
    
    }
  

    //Liabrary Book reader will display
    showReaderComponent(event) {
        this.readerVisible = true;
        console.log('Access Key:',event.target.accessKey);
        console.log('RecordId:',event.currentTarget.dataset.recid);
        this.bookrecordId = event.currentTarget.dataset.recid;

        const selectedEvent = new CustomEvent("progressvaluechange", {
            detail: this.bookrecordId
          });
      
          this.dispatchEvent(selectedEvent);

          
        console.log('Book Record Id:',this.bookrecordId);

      }




}