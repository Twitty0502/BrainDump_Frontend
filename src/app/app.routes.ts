import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { CreateBoard } from './pages/create-board/create-board';
import { JoinBoard } from './pages/join-board/join-board';
import { Board } from './pages/board/board';


export const routes: Routes = [
    { path: '', component: Home },
    { path: 'create-board', component: CreateBoard },
    { path: 'join-board', component: JoinBoard },
    { path: 'board/:id', component: Board }
];
