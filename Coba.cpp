#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;
int binSearchCol(const vector<vector<int> > &A, int B,int row,int start,int end){
    while(start<=end){
        int mid = (start+end)/2;
        if (A[row][mid]==B) return 1;
        else if (A[row][mid]>B) end=mid-1;
        else if (A[row][mid]<B) start=mid+1;
    }
    return 0;
}

int searchMatrix(vector<vector<int> > &A, int B) {
    int row = A.size(), col = A[0].size();
    vector<int> vRow(row);
    for(int i=0;i<A.size();i++){
        vRow[i]=A[i][0];
    }
    int xrow = upper_bound(vRow.begin(),vRow.end(),B) - vRow.begin();
    cout<<"row : "<<xrow<<endl;
    if (!xrow) return 0;
    return binSearchCol(A,B,xrow-1,0,A[0].size()-1);
}

int main(){
  vector<vector<int> > Mat(3);
  Mat[0].push_back(4);
  Mat[0].push_back(6);
  Mat[0].push_back(11);

  Mat[1].push_back(15);
  Mat[1].push_back(17);
  Mat[1].push_back(19);

  Mat[2].push_back(24);
  Mat[2].push_back(27);
  Mat[2].push_back(32);
  int x;
  cin>>x;
  cout<<searchMatrix(Mat,x)<<endl;
}
