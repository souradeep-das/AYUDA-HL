#include<bits/stdc++.h>
using namespace std;
string cleanSpaces(string str)
{
 string space = " ";
 int pos;
 while((pos = str.find(space)) != string::npos)
 {
  str = str.erase(pos, 1);
 }
 return str;
}


vector<double> commaSeparatedStringToDoubleVector(string str)
{
 vector<double> vec;
 while(str.length() > 0)
 {
  int pos = str.find(",");
  if (pos!=string::npos)
  {
   string strNum = str.substr(0, pos);
   strNum = cleanSpaces(strNum);
   vec.push_back(atof(strNum.c_str()));
   str = str.substr(pos+1);
  }
  else
  {
   string strNum = cleanSpaces(str.c_str());
   vec.push_back(atof(strNum.c_str()));
   break;
  }
 }
 return vec;
}



vector<vector<double>> SetSimplex( vector<double> maxFunction,
       vector<vector<double>> A,
       vector<double> b)
{
 vector<vector<double>> simplex;


 int numVariables = maxFunction.size();
 int numEquations = A.size();
 int numCols = numVariables + numEquations + 1 + 1;


 for(int iRow = 0; iRow < numEquations; iRow++)
 {
  vector<double> row(numCols, 0);
  for(int iCol = 0; iCol < numVariables; iCol++)
  {
   row[iCol] = A[iRow][iCol];
  }
  row[numVariables + iRow] = 1;
  row[numCols - 1] = b[iRow];


  simplex.push_back( row );
 }


 vector<double> lastRow(numCols, 0);
 for(int iVar = 0; iVar < numVariables; iVar++)
 {
  lastRow[iVar] = 0 - maxFunction[iVar];
 }
 lastRow[numVariables + numEquations] = 1;
 simplex.push_back(lastRow);


 return simplex;
}





bool GetPivots(vector<vector<double>> simplex, int & pivotCol, int & pivotRow, bool & noSolution)
{
 int numRows = simplex.size();
 int numCols = simplex[0].size();
 int numVariables = numCols - numRows - 1;


 noSolution = false;


 double min = 0;
 for(int iCol = 0; iCol < numCols - 2; iCol++)
 {
  double value = simplex[numRows - 1][iCol];
  if(value < min)
  {
   pivotCol = iCol;
   min = value;
  }
 }


 if(min == 0)
  return false;


 double minRatio = 0.0;
 bool first = true;
 for(int iRow = 0; iRow < numRows - 1; iRow++)
 {
  double value = simplex[iRow][pivotCol];

  if(value > 0.0)
  {
   double colValue = simplex[iRow][numCols - 1];
   double ratio = colValue / value;


   if((first || ratio < minRatio) && ratio >= 0.0)
   {
    minRatio = ratio;
    pivotRow = iRow;
    first = false;
   }
  }
 }


 noSolution = first;
 return !noSolution;
}


vector<double> DoSimplex(vector<vector<double>> simplex, double & max)
{
 int pivotCol, pivotRow;
 int numRows = simplex.size();
 int numCols = simplex[0].size();


 bool noSolution = false;
 while( GetPivots(simplex, pivotCol, pivotRow, noSolution) )
 {
  double pivot = simplex[pivotRow][pivotCol];

  for(int iCol = 0; iCol < numCols; iCol++)
  {
   simplex[pivotRow][iCol] /= pivot;
  }


  for(int iRow = 0; iRow < numRows; iRow++)
  {
   if(iRow != pivotRow)
   {
    double ratio =  -1 * simplex[iRow][pivotCol];
    for(int iCol = 0; iCol < numCols; iCol++)
    {
     simplex[iRow][iCol] = simplex[pivotRow][iCol] * ratio + simplex[iRow][iCol];
    }
   }
  }
 }


 if(noSolution)
 {
  vector<double> vec;
  return vec;
 }

 //optimo!!!
 max = simplex[numRows-1][numCols-1];
 int numVariables = numCols - numRows - 1;
 vector<double> x(numVariables, 0);

 for(int iCol = 0; iCol < numVariables; iCol++)
 {
  bool isUnit = true;
  bool first = true;
  double value;
  for(int j = 0; j < numRows; j++)
  {
   if(simplex[j][iCol] == 1.0 && first)
   {
    first = false;
    value = simplex[j][numCols - 1];
   }
   else if(simplex[j][iCol] != 0.0)
   {
    isUnit = false;
   }
  }


  if(isUnit && !first)
   x[iCol] = value;
  else
   x[iCol] = 0.0;
 }


 return x;
}
vector<vector<double>> Transpose(vector<vector<double>> M)
{

 vector<vector<double>> T;

 int mNumRows = M.size();
 int mNumCols = M[0].size();

 for(int mCol = 0; mCol < mNumCols; mCol++)
 {
  vector<double> tRow;
  for(int mRow = 0; mRow < mNumRows; mRow++)
  {
   tRow.push_back(M[mRow][mCol]);
  }

  T.push_back(tRow);
 }

 return T;

 return M;
}

vector<vector<double>> SetLinearProgram(vector<vector<double>> A)
{
 vector<double> maxFunc;
 vector<double> b;

 vector<vector<double>> T = Transpose(A);

 for(int iRow = 0; iRow < T.size(); iRow++)
 {
  for(int iCol = 0; iCol < T[iRow].size(); iCol++)
  {
   T[iRow][iCol] *= -1.0;
  }
  T[iRow].push_back(  1.0 );
  T[iRow].push_back( -1.0 );
 }

 for(int iRow = 0; iRow < T.size(); iRow++)
 {
  b.push_back( 0.0 );
 }

 int rowSize = T[0].size();

 vector<double> rowEq1(rowSize, 1.0);
 rowEq1[rowSize - 2] = rowEq1[rowSize - 1] = 0.0;
 T.push_back( rowEq1 );
 b.push_back( 1.0 );

 vector<double> rowEq2(rowSize, -1.0);
 rowEq2[rowSize - 2] = rowEq2[rowSize - 1] = 0.0;
 T.push_back( rowEq2 );
 b.push_back( -1.0 );

 for(int i = 0; i < rowSize; i++)
 {
  if( i < rowSize - 2 )
   maxFunc.push_back(1.0);
  else if( i < rowSize - 1 )
   maxFunc.push_back(1.0);
  else
   maxFunc.push_back(-1.0);
 }

 return SetSimplex(maxFunc, T, b);
}


void PrepareRun(vector<vector<double>> A)
{
 vector<vector<double>> simplex = SetLinearProgram(A);
 double max;
 vector<double> result = DoSimplex(simplex, max);
 int size = result.size();
 if( !size )
 {
  printf("No optimal solution exists\n----------------------\n");
  return;
 }
 printf("Result: Max = %f\n", result[size - 2] - result[size - 1]);
 for(int i = 0; i < result.size() - 2; i++)
 {
  printf("x%d = %f ; ", i, result[i]);
 }
 printf("\n----------------------\n");
}
void Run1()
{
 vector<vector<double>> A;
 A.push_back(commaSeparatedStringToDoubleVector(" 1.0 ,  2.0 ,  3.0 , -1.0 ,  1.5"));
 A.push_back(commaSeparatedStringToDoubleVector("-2.0 , -1.5 , -1.0 ,  1.0 ,  3.0"));
 A.push_back(commaSeparatedStringToDoubleVector(" 0.0 ,  1.0 ,  0.5 , -2.0 ,  2.5"));
 A.push_back(commaSeparatedStringToDoubleVector(" 2.0 , -1.0 ,  0.5 , -3.0 , -2.5"));
 A.push_back(commaSeparatedStringToDoubleVector(" 1.5 ,  2.0 , -1.5 ,  2.0 ,  3.5"));

 PrepareRun(A);
}

void Run2()
{
 vector<vector<double>> A;
 A.push_back(commaSeparatedStringToDoubleVector(" 1.0 ,  0.0 "));
 A.push_back(commaSeparatedStringToDoubleVector(" 1.0 ,  0.0 "));

 PrepareRun(A);
}

void Run3()
{
 vector<vector<double>> A;
 A.push_back(commaSeparatedStringToDoubleVector(" 30.0 , -10.0 ,  20.0 "));
 A.push_back(commaSeparatedStringToDoubleVector(" 10.0 ,  20.0 , -20.0 "));

 PrepareRun(A);
}

int main ()
{
 Run1();
 Run2();
 Run3();
}
