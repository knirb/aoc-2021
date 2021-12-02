#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main()
{
  ifstream myfile;
  string line;
  int data [2000];
  int count = 0;

  myfile.open("./input.txt");
  if (myfile.is_open())
  {
    while ( getline (myfile,line) )
    {
      data[count] = stoi(line);
      count++;
    }
    myfile.close();
  }
  else {
    cout << "Unable to open file";
    return 0;
  };
  int res = 0;
  for (int i = 1; i < 2000; i++)
  {
    if (data[i] > data[i-1])
    {
      res++;
    }
  }
  cout << res;
  cout << "\n";
  
  return 0;
}