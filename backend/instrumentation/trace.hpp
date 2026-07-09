#pragma once

#include <iostream>
#include <stack>
#include <string>

using namespace std;

static int idCounter = 0;
static stack<int> activeCalls;
template<typename... Args>
void traceEnter(const string& functionName, Args... args)
{
    int currentId = ++idCounter;

    int parentId = -1;

    if (!activeCalls.empty())
    {
        parentId = activeCalls.top();
    }

    cout << "CALL "
         << currentId << " "
         << parentId << " "
         << functionName;
    ((cout<< " "<<args),...);
    cout<<endl;

    activeCalls.push(currentId);
}

void traceReturn(int result)
{
    if (activeCalls.empty())
        return;

    int currentId = activeCalls.top();

    cout << "RETURN "
         << currentId << " "
         << result << endl;

    activeCalls.pop();
}