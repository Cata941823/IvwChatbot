import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatStructureComponent } from './components/chat-structure/chat-structure.component';

const routes: Routes = [
  { path: '', component: ChatStructureComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
