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

            query=query.replace(nre,allFormValues[field])




        })
    }
    return query

}
