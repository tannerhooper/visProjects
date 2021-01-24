readData = function(){
    d3.csv('data/groups.csv', d => {
        d.Count = parseInt(d.Count);
        return d
    }).then(function(data) {
        // console.log('init data:',data)
        let ranks = {};
        d3.csv('data/ranks.csv',r => { ranks[r.RankId] = r.Rank; }).then(() => {
            const results = [];
            const map = new Map();
            for (const item of data) {
                if(!map.has(item.SName)){
                    map.set(item.SName, {c:item.Count,n:1,l:item.Leader,r:item.RankId,g:item.Name,cl:item.Classification});
                }
                else {
                    let tmp = map.get(item.SName);
                    map.set(item.SName,{c:tmp.c+item.Count,n:tmp.n+1,l:tmp.l,r:tmp.r,g:tmp.g,cl:tmp.cl})
                }
            }
            for (let [k,v] of map.entries()){
                let z = parseInt(v.r);
                let q = parseInt(v.cl)
                results.push({name:k,c:v.c,n:v.n,l:v.l,r:z,g:v.g,cl:q})
            }

            let tree = new Tree();
            tree.createTree(data);
            const d = [data,results,ranks];

            let table = new Table(d,tree);
            table.createTable();
            table.updateTable();
        });
    });
}();