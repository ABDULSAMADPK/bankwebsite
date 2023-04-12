import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import party from "party-js";
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  logoutDiv:boolean=false
  user:string=''
  isCollapse:boolean=true
  currentAcno:Number=0
  balance:Number=0
  acno:any='';
  deleteConfirm:boolean = false
  deleteSpinnerDiv:boolean=false
  depositForm = this.fb.group({
    amount: ['', [Validators.required, Validators.pattern('[0-9]*')]],
  })
  depositMsg:string=''
  constructor(private api:ApiService,private fb:FormBuilder,private router:Router){

  }
  ngOnInit() {
    //to check the account holder already logged in
    if(!localStorage.getItem('token')){
      alert('Please Login!!!')
      //navigate to login
      this.router.navigateByUrl('')
    }

    if(localStorage.getItem("username")){
      this.user =  localStorage.getItem("username")||''
    }
  }

  collapse(){
    this.isCollapse =!this.isCollapse
  }

  getBalance(){
    if(localStorage.getItem("currentAcno")){
      this.currentAcno = JSON.parse(localStorage.getItem("currentAcno")||'')
      this.api.getBalance(this.currentAcno)
      .subscribe(
        (result:any)=>{
          console.log(result);
          this.balance = result.balance
        }
      )
    }
  }

  //deposit
  deposit(){
    if(this.depositForm.valid){
      let amount = this.depositForm.value.amount
      this.currentAcno = JSON.parse(localStorage.getItem("currentAcno")||'')
      this.api.deposit(this.currentAcno,amount)
      .subscribe(
        //success
        (result:any)=>{
          console.log(result);
          this.depositMsg=result.message
          setTimeout(()=>{
            this.depositForm.reset()
            this.depositMsg=''
          },3000)
        },
        //error
        (result:any)=>{
          this.depositMsg=result.error.message
        }
      )
    }
    else{
      alert('Invalid Form')
    }
  }

  //showconfetti
  showconfetti(source:any){
    party.confetti(source);
  }

  //logout
  logout(){
    localStorage.removeItem('username')
    localStorage.removeItem('token')
    localStorage.removeItem('currentAcno')
    this.logoutDiv = true

    //navigate to login
    setTimeout(() => {
      this.router.navigateByUrl('')
      this.logoutDiv = false
    }, 4000);
  }

  //deleteAccountFromNavBar
  deleteAccountFromNavBar(){
    this.acno = localStorage.getItem("currentAcno")
    this.deleteConfirm = true
  }
  onCancel(){
    this.acno = ''
    this.deleteConfirm = false
  }
  onDelete(event:any){
    let deleteAcno = JSON.parse(event)
    this.api.deleteAccount(deleteAcno)
    .subscribe(
      (result:any)=>{
        this.acno = ''
        localStorage.removeItem('username')
        localStorage.removeItem('token')
        localStorage.removeItem('currentAcno')
        this.deleteSpinnerDiv = true
       
        setTimeout(() => {
          this.router.navigateByUrl('')
          this.deleteSpinnerDiv = false
        }, 4000);
      },
      (result:any)=>{
        alert(result.error.message)
      }
    )
  }
}
