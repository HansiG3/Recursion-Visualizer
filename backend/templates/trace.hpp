#pragma once
#include<iostream>

void traceEnter(const std::string& name,int value){
    std::cout<<"CALL "<<name<<" "<<value<<std::endl;
}
void traceReturn(int value){
    std::cout<<"RETURN "<<value<<std::endl;
}