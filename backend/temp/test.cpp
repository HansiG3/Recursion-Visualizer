#include <iostream>
#include "trace.hpp"

using namespace std;

int fact(int n){

    traceEnter("fact", n);

    if(n==1){
        traceReturn(1);
        return 1;
    }

    int result = n * fact(n-1);

    traceReturn(result);

    return result;
}

int main(){
    cout << fact(4);
}