import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import jspdf from 'jspdf';
import 'jspdf-autotable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  allTransactions: any;
  searchKey: string = ''

  constructor(private api: ApiService,private router:Router) {

  }

  ngOnInit(): void {
     //to check the account holder already logged in
     if(!localStorage.getItem('token')){
      alert('Please Login!!!')
      //navigate to login
      this.router.navigateByUrl('')
    }
    this.api.getAllTransactions()
      .subscribe((result: any) => {
        console.log(result);
        this.allTransactions = result.transaction
        console.log(this.allTransactions);
      })
  }

  //search
  search(event: any) {
    this.searchKey = event.target.value
  }

  //generatepdf()
  generatePDF() {
    var pdf = new jspdf()
    let col = ['Type', 'FromAcno', 'ToAcno', 'Amount']
    let row: any = []
    pdf.setFontSize(16);
    pdf.text('Transaction History', 11, 8);
    pdf.setFontSize(12);
    pdf.setTextColor(99);

    // convert allTransaction to nested array
    var itemNew = this.allTransactions
    for(let element of itemNew){
      var temp = [element.type, element.fromAcno, element.toAcno, element.amount]
      row.push(temp)
    }

      (pdf as any).autoTable(col, row, { startY: 10 })
    // Open PDF document in browser's new tab
    pdf.output('dataurlnewwindow')
    // Download PDF doc  
    pdf.save('ministatement.pdf');
  }
}
