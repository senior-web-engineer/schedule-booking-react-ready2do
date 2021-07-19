import * as log from 'loglevel';
import React, { useEffect } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import GridList from '@material-ui/core/GridList'
import { makeStyles } from '@material-ui/core/styles';
import ImageUploader from 'react-images-upload';
import ImageGalleryEdit from './ImageGalleryEdit';
import {StruttureSelectors} from '../../store/selectors/strutture.selectors'
import {StruttureActionsCreator} from '../../store/actions/strutture.actions'
const _logger = log.getLogger('StrutturaEditImages');

const useStyles = makeStyles(theme=>({
	root:{
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		overflow: 'hidden',
		backgroundColor: theme.palette.background.paper,
	  },	
	gridList:{
		width: '100%',
		height: '100%'
	},
}));

export default (props) =>{
    _logger.debug("StrutturaEditImages....")
	const images =  useSelector(StruttureSelectors.getImages);
	const idStruttura = props.idStruttura;
	const dispatch = useDispatch();
	const classes = useStyles();

	function onDrop(){
		_logger.debug(arguments);
	}

	useEffect(()=>{
		_logger.debug("StrutturaEditImages->useEffect()");
		async function fetchData(){
			_logger.debug("StrutturaEditImages->fetchData()");
			//if(!images || (Array.isArray(images) && images.length === 0)){
				 if(idStruttura && idStruttura > 0){
					_logger.debug(`StrutturaEditImages->useEffect() - Dispatching action fetchStrutturaImmagini(${idStruttura})`);
					const action = StruttureActionsCreator.fetchStrutturaImmagini({idStruttura});
					dispatch(action);
				 }else{
				 	_logger.debug(`images already popolated, loading not needed. idStruttura: ${idStruttura} - images: ${JSON.stringify(images)}`);
				 }
			};
			fetchData();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[idStruttura])

	const resolveTipoImmagine = (idTipo)=>{
		switch(idTipo){		
			case 1: return "sfondo";
			case 2: return "logo";
			default: return "gallery";
		}
	}
	const renderImages = ()=>{
		if(!images) return (<div></div>);
		//Solo immagini della gallery
		let filtered = images.filter((img)=>img.idTipoImmagine === 3);
		_logger.debug(`Iamges filtered: ${JSON.stringify(filtered)}`);

		return(
			<GridList cellHeight={'auto'} cols={2.5} spacing={10} className={classes.gridList}>
			{
				filtered.map((item, idx)=>{return (<ImageGalleryEdit key={item.id} order={idx} imageKey={item.id} imageType={resolveTipoImmagine(item.idTipoImmagine)} imageUrl={item.url}></ImageGalleryEdit>)})
			}
			</GridList>
			);
}

    return (
        <React.Fragment>
			 <ImageUploader
				withIcon={true}
				buttonText='Choose images'
				onChange={onDrop}
				imgExtension={['.jpg', '.gif', '.png', '.gif']}
				maxFileSize={5242880}
			/>
			<div className={classes.root}>
				{renderImages()}
			</div>
        </React.Fragment>
    )
}