import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-feed-container',
  imports: [MatSidenavModule, MatButtonModule],
  templateUrl: './feed-container.html',
  styleUrl: './feed-container.scss',
})
export class FeedContainer {}
