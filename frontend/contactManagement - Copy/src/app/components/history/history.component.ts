import { Component, OnInit } from '@angular/core';
import { User } from 'src/shared/model/user';
import { UserService } from 'src/shared/service/user/user.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit{
  userData : User | any;
  constructor(public userService : UserService){
    this.userData = this.userService.userInfo.history;
    console.log("history",this.userData.history);
  }
  ngOnInit(): void {
    this.userService.userInfo.history.sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
  }

  getTimeAgo(timestamp: string): string {
    const timeDiff = Date.now() - Date.parse(timestamp);

    const MINUTE = 60 * 1000;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const WEEK = 7 * DAY;
    const MONTH = 4 * WEEK;
  
    if (timeDiff < MINUTE) {
        return 'just now';
    } else if (timeDiff < HOUR) {
        const mins = Math.floor(timeDiff / MINUTE);
        return `${mins}m ago`;
    } else if (timeDiff < DAY) {
        const hours = Math.floor(timeDiff / HOUR);
        return `${hours}h ago`;
    } else if (timeDiff < WEEK) {
        const days = Math.floor(timeDiff / DAY);
        return `${days}d ago`;
    } else if (timeDiff < MONTH) {
        const weeks = Math.floor(timeDiff / WEEK);
        return `${weeks}w ago`;
    } else {
        const months = Math.floor(timeDiff / MONTH);
        return `${months}mo ago`;
    }
}
  getMessageIcon(msgType: string) {
    switch (msgType) {
      case 'login':
        return 'fa-circle-check';
      case 'update':
        return 'fa-thumbs-up';
      case 'remove':
        return 'fa-square-minus';
      case 'file':
        return 'fa-floppy-disk';
      default:
        return 'fa-handshake';
    }
  }
  
  getMessageIconClass(msgType: string) {
    switch (msgType) {
      case 'login':
        return 'success';
      case 'update':
        return 'warning';
      case 'remove':
        return 'danger';
      case 'file':
        return 'info';
      // Add more cases for other types of messages
      default:
        return 'primary';
    }
  }
  timelineDetails = [
    {
      type: 'login',
      content : 'keerthana logged in',
      timestamp: '11 hours ago via Something'
    },
    {
      type: 'update',
      content : 'keerthana updated details',
      timestamp: '12 hours ago via Something'
    },
    {
      type: 'remove',
      content : 'remove some data from details',
      timestamp: '26 hours ago via Something'
    },
    {
      type: 'file',
      content : 'keerthana  add new attachemnets',
      timestamp: '13 hours ago via Something'
    },
    {
      type: 'new',
      content : 'keerthana  add new attachemnets',
      timestamp: '13 hours ago via Something'
    },
  ];
}
