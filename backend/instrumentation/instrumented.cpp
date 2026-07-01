#include "trace.hpp"
    
#include <iostream>
using namespace std;

int fact(int n)
{
    traceEnter("fact", n);

    if(n==1)
        {
        auto __trace_result=1;
        traceReturn(__trace_result);
        return __trace_result;
    }

    {
        auto __trace_result=n*fact(n-1);
        traceReturn(__trace_result);
        return __trace_result;
    }
}

int main()
{
    cout << fact(5);
}
