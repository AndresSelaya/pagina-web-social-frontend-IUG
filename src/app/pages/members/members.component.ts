import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Member } from '../../posts/models/member'; 

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {
  members: Member[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Member[]>('/assets/data-iug/members.json').subscribe(data => {
      this.members = data;
    });
  }
}