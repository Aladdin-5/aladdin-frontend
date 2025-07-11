import {  AxiosRequestConfig } from 'axios';
export interface ApiParams {
  [key: string]: any;
}

export interface ApiData {
  [key: string]: any;
}

export interface ApiConfig extends AxiosRequestConfig {
  [key: string]: any;
}