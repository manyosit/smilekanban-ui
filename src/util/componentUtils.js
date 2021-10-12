 function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
export const translateQuery=(query,allFormValues)=>{
    let re=/\$\{.*?\}/g
    const matches = query.match(re)

    if (matches && matches.length > 0){
        matches.forEach(e=>{

            const field=e.substring(2, e.length-1)
            const nre = new RegExp(escapeRegExp(e));

            if (typeof allFormValues[field] === "string"){
                query=query.replace(nre,allFormValues[field])
            }else{
                if(allFormValues[field] && Array.isArray(allFormValues[field].values) && allFormValues[field].joinOperator){
                    const oQuery=query;
                    allFormValues[field].values.forEach((e,i)=>{

                        if (i===0){
                            query=oQuery.replace(nre,e)
                        }else{
                            query = query + ` ${allFormValues[field].joinOperator} ${oQuery.replace(nre,e)}`
                        }
                    })
                }
            }





        })
    }
    return query

}
