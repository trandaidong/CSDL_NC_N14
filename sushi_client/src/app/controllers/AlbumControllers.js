class AlbumControlle{
    index(req,res){
        res.render('album',{layout:'main'});
    }
}


module.exports=new AlbumControlle;