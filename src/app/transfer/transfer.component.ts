import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
 
  fundTransferSuccessMsg:string=''
  fundTransferErrorMsg:string=''

  fundTransferForm = this.fb.group({
    //array
    toAcno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    pswd: ['', [Validators.required, Validators.pattern('[0-9a-zA-Z]*')]],
    amount: ['', [Validators.required, Validators.pattern('[0-9]*')]]
  })
  
  constructor(private api:ApiService ,private fb: FormBuilder,private router:Router){

  }
  ngOnInit(): void {
    //to check the account holder already logged in
    if(!localStorage.getItem('token')){
      alert('Please Login!!!')
      //navigate to login
      this.router.navigateByUrl('')
    }
  }

  transfer(){
    if(this.fundTransferForm.valid){
      let toAcno = this.fundTransferForm.value.toAcno
      let pswd = this.fundTransferForm.value.pswd
      let amount = this.fundTransferForm.value.amount
      //make api call for fund transfer
      this.api.fundTransfer(toAcno,pswd,amount)
      .subscribe(
        //success
        (result:any)=>{
          this.fundTransferSuccessMsg = result.message
          setTimeout(() => {
            this.fundTransferSuccessMsg=''
          },3000);
        },
        //clienterror
        (result:any)=>{
          this.fundTransferErrorMsg = result.error.message
          setTimeout(() => {
            this.fundTransferErrorMsg=''
          },3000);
        }
      )
    }
    else{
      alert('Invalid Form')
    }
  }

  //clear fundtransfer form
  clearFundTransferForm(){
    this.fundTransferErrorMsg=''
    this.fundTransferSuccessMsg=''
    this.fundTransferForm.reset()
  }
}
