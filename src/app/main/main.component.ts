import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {
  username: string = '';
  password: string = '';
  isLoggedIn = false;
  private loggedInSubscription!: Subscription;
  selectedFile: File | null = null;
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loggedInSubscription = this.authService.isLoggedIn.subscribe(
      (loggedIn: boolean) => {
        this.isLoggedIn = loggedIn;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.loggedInSubscription) {
      this.loggedInSubscription.unsubscribe();
    }
  }

  async login(event: Event): Promise<void> {
    event.preventDefault();
    if (await this.authService.login(this.username, this.password)) {
      this.username = '';
      this.password = '';
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.selectedFile = target.files[0];
    }
  }

  convertFileToXML(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
  
          const xml = this.generateXML(json);
          console.log('Generated XML:', xml);
  
          // Save the XML file
          const blob = new Blob([xml], { type: 'text/xml' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'converted.xml';
          link.click();
        }
      };
      reader.readAsBinaryString(this.selectedFile);
    } else {
      alert('Please select a file to convert');
    }
  }

  generateXML(data: any[][]): string {
    let xml = '<?xml version="1.0" encoding="utf-8"?>\n<Awmcds>\n';

    for (let i = 1; i < data.length; i++) {
      xml += '\t<Bol_segment>\n\t\t<Bol_id>\n';
      for (let j = 0; j < data[0].length; j++) {
        xml += `\t\t\t<${data[0][j]}>${data[i][j]}</${data[0][j]}>\n`;
      }
      xml += '\t\t</Bol_id>\n\t</Bol_segment>\n';
    }

    xml += '</Awmcds>';
    return xml;
  }
}
