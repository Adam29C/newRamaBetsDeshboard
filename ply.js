let a="abcabcdcabcaaaa";
let b=[];//first stap
let variable= [];
for(let i=0;i<a.length;i++){
    b[b.length]=a[i];
};


for(let c=0;c<b.length;c++){
    variable[variable.length]={val:b[c],count:0}
    for(let d=b.length;d<b.length;b++){
    if(variable[0].val=b[c]){
        variable[0].val+1;
    }
}
}
console.log(variable)