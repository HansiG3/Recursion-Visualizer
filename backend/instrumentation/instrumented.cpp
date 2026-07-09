#include "trace.hpp"
    #include <iostream>
using namespace std;

int fib(int n)
{
    traceEnter("fib", n);

    if (n <= 1)
        {
        auto __trace_result=n;
        traceReturn(__trace_result);
        return __trace_result;
    }

    {
        auto __trace_result=fib(n - 1) + fib(n - 2);
        traceReturn(__trace_result);
        return __trace_result;
    }
}

int main()
{
    cout << fib(5);
    return 0;
}