(function(){
    var script = {
 "horizontalAlign": "left",
 "children": [
  "this.MainViewer",
  "this.Container_22BB12F4_3075_D173_4184_EC3BC4955417",
  "this.Container_EF8F8BD8_E386_8E03_41E3_4CF7CC1F4D8E",
  "this.Container_4041C033_7558_FB6E_41CE_BFE427F3AF92",
  "this.Container_062AB830_1140_E215_41AF_6C9D65345420",
  "this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15",
  "this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7",
  "this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41",
  "this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E",
  "this.Container_1E18823C_57F1_802D_41C1_C325A6BB2CA9"
 ],
 "id": "rootPlayer",
 "scrollBarMargin": 2,
 "width": "100%",
 "buttonToggleFullscreen": "this.IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0",
 "start": "this.init(); this.visibleComponentsIfPlayerFlagEnabled([this.IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A], 'gyroscopeAvailable'); this.syncPlaylists([this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist,this.mainPlayList]); if(!this.get('fullscreenAvailable')) { [this.IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0].forEach(function(component) { component.set('visible', false); }) }",
 "contentOpaque": false,
 "defaultVRPointer": "laser",
 "scripts": {
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "registerKey": function(key, value){  window[key] = value; },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "existsKey": function(key){  return key in window; },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "getKey": function(key){  return window[key]; },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "unregisterKey": function(key){  delete window[key]; },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; }
 },
 "downloadEnabled": false,
 "minHeight": 20,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "buttonToggleMute": "this.IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D",
 "minWidth": 20,
 "layout": "absolute",
 "borderRadius": 0,
 "paddingLeft": 0,
 "definitions": [{
 "displayOriginPosition": {
  "yaw": -152.72,
  "hfov": 165,
  "class": "RotationalCameraDisplayPosition",
  "stereographicFactor": 1,
  "pitch": -90
 },
 "automaticRotationSpeed": 12,
 "id": "panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_camera",
 "displayMovements": [
  {
   "easing": "linear",
   "duration": 1000,
   "class": "TargetRotationalCameraDisplayMovement"
  },
  {
   "targetPitch": -6.26,
   "targetStereographicFactor": 0,
   "easing": "cubic_in_out",
   "duration": 3000,
   "targetHfov": 134,
   "class": "TargetRotationalCameraDisplayMovement"
  }
 ],
 "initialPosition": {
  "yaw": -152.72,
  "hfov": 134,
  "class": "PanoramaCameraPosition",
  "pitch": -6.26
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_camera",
 "initialPosition": {
  "yaw": 41.89,
  "class": "PanoramaCameraPosition",
  "pitch": -4.56
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "camera_63BD6C01_6E23_DFB9_41D5_D807AC513648",
 "initialPosition": {
  "yaw": -19.57,
  "hfov": 135,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_camera",
 "initialPosition": {
  "yaw": 107.51,
  "hfov": 142,
  "class": "PanoramaCameraPosition",
  "pitch": -3.72
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "camera_63EFFC24_6E23_DFFF_41C7_8A4E2890E0F9",
 "initialPosition": {
  "yaw": 97.25,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "items": [
  {
   "media": "this.panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_camera"
  },
  {
   "media": "this.panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_camera"
  },
  {
   "media": "this.panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_camera"
  },
  {
   "media": "this.panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_camera"
  },
  {
   "media": "this.panorama_6BBC953E_608C_D399_4188_6D733FA23DA5",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_camera"
  },
  {
   "media": "this.panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_camera"
  },
  {
   "media": "this.panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_camera"
  },
  {
   "media": "this.panorama_6BC659E9_608C_32BB_41D1_365F5B17814C",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_camera"
  },
  {
   "media": "this.panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_camera"
  },
  {
   "media": "this.panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_camera"
  },
  {
   "media": "this.panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_camera"
  },
  {
   "media": "this.panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_camera"
  },
  {
   "media": "this.panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 13)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_camera"
  },
  {
   "media": "this.panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 13, 14)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_camera"
  },
  {
   "media": "this.panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 14, 15)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_camera"
  },
  {
   "media": "this.panorama_6BDDB18C_608C_3379_41D0_4888B6706F93",
   "end": "this.trigger('tourEnded')",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 15, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_camera"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_t.jpg",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "Piscina 1",
 "hfovMin": "135%",
 "id": "panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0",
 "overlays": [
  "this.overlay_45475AE9_608C_56BB_41B3_D29FE1C2A7CA",
  "this.overlay_46C8F6AD_608C_3EBB_41D8_292FE30FDA53",
  "this.overlay_45155781_6084_7F6B_41B6_6BD2FF7F3061"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6"
  },
  {
   "yaw": 16.61,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6",
   "backwardYaw": -167.66
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484"
  }
 ],
 "hfov": 360,
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "thumbnailUrl": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_t.jpg",
 "hfovMax": 130
},
{
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_t.jpg",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "Parquinho 3",
 "hfovMin": "135%",
 "id": "panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86",
 "overlays": [
  "this.overlay_473C5C2C_609C_51BA_41BD_8613B7AD5DD7"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "yaw": -82.75,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8",
   "backwardYaw": 67.86
  }
 ],
 "hfov": 360,
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "thumbnailUrl": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_t.jpg",
 "hfovMax": 130
},
{
 "id": "camera_7E87BB94_6E23_D8DE_41B4_B7682A9C00DF",
 "initialPosition": {
  "yaw": -137.14,
  "hfov": 130,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "camera_7E957B9B_6E23_D8CA_41D3_5DD14F43FE93",
 "initialPosition": {
  "yaw": -87.77,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_t.jpg",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "Entrada",
 "hfovMin": "135%",
 "id": "panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36",
 "overlays": [
  "this.overlay_41B4FB78_609C_379A_41CD_2B297351E097"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6BDDB18C_608C_3379_41D0_4888B6706F93"
  }
 ],
 "hfov": 360,
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "thumbnailUrl": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_t.jpg",
 "hfovMax": 143
},
{
 "id": "panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_camera",
 "initialPosition": {
  "yaw": 61.48,
  "hfov": 137,
  "class": "PanoramaCameraPosition",
  "pitch": -5.54
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "viewerArea": "this.MainViewer",
 "buttonCardboardView": "this.IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB",
 "buttonToggleHotspots": "this.IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96",
 "displayPlaybackBar": true,
 "touchControlMode": "drag_rotation",
 "gyroscopeVerticalDraggingEnabled": true,
 "id": "MainViewerPanoramaPlayer",
 "class": "PanoramaPlayer",
 "buttonToggleGyroscope": "this.IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A",
 "mouseControlMode": "drag_acceleration"
},
{
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_t.jpg",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "Lateral",
 "hfovMin": "135%",
 "id": "panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0",
 "overlays": [
  "this.overlay_571F7629_6183_D1BB_41D7_4247766AA1CE",
  "this.overlay_57390319_6184_D79B_41B9_4A6B8D7CE925"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6"
  }
 ],
 "hfov": 360,
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "thumbnailUrl": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_t.jpg",
 "hfovMax": 137
},
{
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_t.jpg",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "Quarto (Sinuca 1)",
 "hfovMin": "135%",
 "id": "panorama_6BC659E9_608C_32BB_41D1_365F5B17814C",
 "overlays": [
  "this.overlay_4EAC6CB4_617C_D2A9_41D3_BCC38DC7A475",
  "this.overlay_4EA66959_617D_D39B_41D5_14F977BE6124"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "yaw": 116.6,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65",
   "backwardYaw": -45.69
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6"
  }
 ],
 "hfov": 360,
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "thumbnailUrl": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_t.jpg",
 "hfovMax": 136
},
{
 "id": "camera_7EC0DBB0_6E23_D8D6_41D8_C802D3D34441",
 "initialPosition": {
  "yaw": 149.88,
  "hfov": 130,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "camera_7EDF7BBE_6E23_D8CA_4194_BF8E70B941BB",
 "initialPosition": {
  "yaw": -24.47,
  "hfov": 142,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_camera",
 "initialPosition": {
  "yaw": 44.94,
  "hfov": 136,
  "class": "PanoramaCameraPosition",
  "pitch": -13.4
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_camera",
 "initialPosition": {
  "yaw": 36.08,
  "hfov": 130,
  "class": "PanoramaCameraPosition",
  "pitch": 8.1
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_camera",
 "initialPosition": {
  "yaw": 146.41,
  "hfov": 130,
  "class": "PanoramaCameraPosition",
  "pitch": 7.96
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "camera_63872C08_6E23_DFB7_41C8_AD3F6844A9BD",
 "initialPosition": {
  "yaw": 123,
  "hfov": 136,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_t.jpg",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "Parquinho 2",
 "hfovMin": "135%",
 "id": "panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8",
 "overlays": [
  "this.overlay_4BF10C17_6084_7195_41BF_573AB1FC3C1C",
  "this.overlay_4BAA53FE_608C_5699_41C6_D7B378EF74EB"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "yaw": -90.66,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A",
   "backwardYaw": 134.18
  },
  {
   "yaw": 67.86,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86",
   "backwardYaw": -82.75
  }
 ],
 "hfov": 360,
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "thumbnailUrl": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_t.jpg",
 "hfovMax": 130
},
{
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_t.jpg",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "Quarto (Sinuca 2)",
 "hfovMin": "135%",
 "id": "panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65",
 "overlays": [
  "this.overlay_5121D802_6184_5169_41D1_5C2831E37815",
  "this.overlay_52286732_618C_7FA9_4164_11A432ED0F5C",
  "this.overlay_525B547B_618C_719F_41D2_4C4E4CEC47FE"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0"
  },
  {
   "yaw": -45.69,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_6BC659E9_608C_32BB_41D1_365F5B17814C",
   "backwardYaw": 116.6
  },
  {
   "yaw": 160.43,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F",
   "backwardYaw": -12.03
  }
 ],
 "hfov": 360,
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "thumbnailUrl": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_t.jpg",
 "hfovMax": 135
},
{
 "id": "panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_camera",
 "initialPosition": {
  "yaw": 92.95,
  "class": "PanoramaCameraPosition",
  "pitch": -5.46
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "items": [
  {
   "media": "this.panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_camera"
  },
  {
   "media": "this.panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_camera"
  },
  {
   "media": "this.panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_camera"
  },
  {
   "media": "this.panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_camera"
  },
  {
   "media": "this.panorama_6BBC953E_608C_D399_4188_6D733FA23DA5",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_camera"
  },
  {
   "media": "this.panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_camera"
  },
  {
   "media": "this.panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_camera"
  },
  {
   "media": "this.panorama_6BC659E9_608C_32BB_41D1_365F5B17814C",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 7, 8)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_camera"
  },
  {
   "media": "this.panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 8, 9)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_camera"
  },
  {
   "media": "this.panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 9, 10)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_camera"
  },
  {
   "media": "this.panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 10, 11)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_camera"
  },
  {
   "media": "this.panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 11, 12)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_camera"
  },
  {
   "media": "this.panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 12, 13)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_camera"
  },
  {
   "media": "this.panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 13, 14)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_camera"
  },
  {
   "media": "this.panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 14, 15)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_camera"
  },
  {
   "media": "this.panorama_6BDDB18C_608C_3379_41D0_4888B6706F93",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 15, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_camera"
  }
 ],
 "id": "ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist",
 "class": "PlayList"
},
{
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_t.jpg",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "Quarto (Sinuca 4)",
 "hfovMin": "135%",
 "id": "panorama_6BBC953E_608C_D399_4188_6D733FA23DA5",
 "overlays": [
  "this.overlay_59C5365B_619D_D19F_41BD_B11F68911E23",
  "this.overlay_59E1BA5B_619C_519F_41BF_A03BDDCF3357"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1"
  },
  {
   "yaw": -57,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F",
   "backwardYaw": 155.53
  }
 ],
 "hfov": 360,
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "thumbnailUrl": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_t.jpg",
 "hfovMax": 142
},
{
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_t.jpg",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "Piscina 2",
 "hfovMin": "135%",
 "id": "panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6",
 "overlays": [
  "this.overlay_5EDFDEE2_61BF_CEA9_41C3_CCB6A398007B",
  "this.overlay_21220603_61BC_D16F_41A1_22A3AA930273"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "yaw": 15.1,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466",
   "backwardYaw": -149.2
  },
  {
   "yaw": -167.66,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0",
   "backwardYaw": 16.61
  }
 ],
 "hfov": 360,
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "thumbnailUrl": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_t.jpg",
 "hfovMax": 130
},
{
 "id": "panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_camera",
 "initialPosition": {
  "yaw": -74.87,
  "hfov": 129,
  "class": "PanoramaCameraPosition",
  "pitch": -19.78
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_t.jpg",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "Churrasqueira",
 "hfovMin": "135%",
 "id": "panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466",
 "overlays": [
  "this.overlay_5C429145_6184_33EB_41C7_A76E66937BA4",
  "this.overlay_5C4F9703_6184_DF6F_41A4_FAB3865DC610"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "yaw": -149.2,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6",
   "backwardYaw": 15.1
  },
  {
   "yaw": 92.23,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A",
   "backwardYaw": -57.5
  }
 ],
 "hfov": 360,
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "thumbnailUrl": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_t.jpg",
 "hfovMax": 130
},
{
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_t.jpg",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "Parquinho 1",
 "hfovMin": "135%",
 "id": "panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A",
 "overlays": [
  "this.overlay_48F5B6DA_609C_5E99_41BC_E60BC39B686F",
  "this.overlay_48CC19BA_609C_5299_41D0_741742112F65"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "yaw": -57.5,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466",
   "backwardYaw": 92.23
  },
  {
   "yaw": 134.18,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8",
   "backwardYaw": -90.66
  }
 ],
 "hfov": 360,
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "thumbnailUrl": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_t.jpg",
 "hfovMax": 130
},
{
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_t.jpg",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "Entrada (Subida 1)",
 "hfovMin": "135%",
 "id": "panorama_6BDDB18C_608C_3379_41D0_4888B6706F93",
 "overlays": [
  "this.overlay_41A3A182_6085_D369_41D4_8B3AD297B618",
  "this.overlay_487C8BD1_608C_56EB_41A2_52F20A8FAAE3"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "yaw": 42.86,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484",
   "backwardYaw": -30.12
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36"
  }
 ],
 "hfov": 360,
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "thumbnailUrl": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_t.jpg",
 "hfovMax": 130
},
{
 "id": "camera_63917C0F_6E23_DFC9_41C6_71E1A531D0A6",
 "initialPosition": {
  "yaw": 30.8,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_camera",
 "initialPosition": {
  "yaw": -62.72,
  "hfov": 136,
  "class": "PanoramaCameraPosition",
  "pitch": -7.13
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_camera",
 "initialPosition": {
  "yaw": 107.28,
  "hfov": 130,
  "class": "PanoramaCameraPosition",
  "pitch": -3.09
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "camera_7ED1ABB7_6E23_D8DA_41BE_863C5F9C4D27",
 "initialPosition": {
  "yaw": -112.14,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "camera_63B44BF9_6E23_D849_41D5_4579FBA18D4B",
 "initialPosition": {
  "yaw": 122.5,
  "hfov": 130,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_camera",
 "initialPosition": {
  "yaw": 132.74,
  "hfov": 123,
  "class": "PanoramaCameraPosition",
  "pitch": -12.16
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "camera_7EE21BA2_6E23_D8FA_41D5_4C9266B27358",
 "initialPosition": {
  "yaw": 89.34,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "camera_63E4CC1D_6E23_DFC9_41CF_92F7BA7A8567",
 "initialPosition": {
  "yaw": -45.82,
  "hfov": 130,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "camera_639A8C16_6E23_DFDB_41D5_F67C8B6C6C05",
 "initialPosition": {
  "yaw": -163.39,
  "hfov": 130,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_camera",
 "initialPosition": {
  "yaw": -90.52,
  "hfov": 136,
  "class": "PanoramaCameraPosition",
  "pitch": -15.65
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_t.jpg",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "Quarto (Piscina/Churrasqueira)",
 "hfovMin": "135%",
 "id": "panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1",
 "overlays": [
  "this.overlay_5D2A6A2F_6184_71B7_41B6_BAA90A4D942C",
  "this.overlay_5DB2970A_6183_FF7E_41D3_F5F4414F7269"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6BBC953E_608C_D399_4188_6D733FA23DA5"
  }
 ],
 "hfov": 360,
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "thumbnailUrl": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_t.jpg",
 "hfovMax": 150
},
{
 "id": "panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_camera",
 "initialPosition": {
  "yaw": 52.43,
  "hfov": 130,
  "class": "PanoramaCameraPosition",
  "pitch": -2.61
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "camera_63F93C2B_6E23_DFC9_41D0_447D3FA69909",
 "initialPosition": {
  "yaw": 12.34,
  "hfov": 123,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_t.jpg",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "Quarto (Sinuca 3)",
 "hfovMin": "135%",
 "id": "panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F",
 "overlays": [
  "this.overlay_58B6D525_6183_D3AB_41CA_DF4615F0F4AF",
  "this.overlay_58B070BA_6184_D299_417D_43DE9D81A59E"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "yaw": -12.03,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65",
   "backwardYaw": 160.43
  },
  {
   "yaw": 155.53,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_6BBC953E_608C_D399_4188_6D733FA23DA5",
   "backwardYaw": -57
  }
 ],
 "hfov": 360,
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "thumbnailUrl": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_t.jpg",
 "hfovMax": 145
},
{
 "id": "camera_7EF3ABA9_6E23_D8F6_41D4_6E5DB8BED751",
 "initialPosition": {
  "yaw": 134.31,
  "hfov": 135,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_t.jpg",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "Entrada (Subida 2)",
 "hfovMin": "135%",
 "id": "panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484",
 "overlays": [
  "this.overlay_43F52718_6084_5F99_41CE_E7B49771F064",
  "this.overlay_43FDB33C_60BC_7799_41D4_54B45407D00B"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "yaw": -30.12,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_6BDDB18C_608C_3379_41D0_4888B6706F93",
   "backwardYaw": 42.86
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0"
  }
 ],
 "hfov": 360,
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "thumbnailUrl": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_t.jpg",
 "hfovMax": 130
},
{
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0/f/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0/l/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0/u/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0/r/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0/b/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_t.jpg",
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0/d/0/{row}_{column}.jpg",
      "colCount": 5,
      "rowCount": 5,
      "width": 2560,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 2560
     },
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "rowCount": 3,
      "width": 1536,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1536
     },
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "rowCount": 2,
      "width": 1024,
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "height": 1024
     },
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "rowCount": 1,
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "height": 512
     }
    ]
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "Sinuca",
 "hfovMin": "135%",
 "id": "panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6",
 "overlays": [
  "this.overlay_4E943164_608C_53A9_41AC_0DE7E0F8B63E",
  "this.overlay_4E162BCB_6087_D6FE_41D6_689D77202A98",
  "this.overlay_4FE11FC7_6084_4EF7_41D5_53970B41910A"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6BC659E9_608C_32BB_41D1_365F5B17814C"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0"
  }
 ],
 "hfov": 360,
 "class": "Panorama",
 "pitch": 0,
 "vfov": 180,
 "thumbnailUrl": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_t.jpg",
 "hfovMax": 130
},
{
 "id": "panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_camera",
 "initialPosition": {
  "yaw": 178.9,
  "hfov": 135,
  "class": "PanoramaCameraPosition",
  "pitch": -7.63
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_camera",
 "initialPosition": {
  "yaw": -85.83,
  "class": "PanoramaCameraPosition",
  "pitch": -19.24
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "camera_7EB6EB8D_6E23_D8CE_41D8_74312234EFA4",
 "initialPosition": {
  "yaw": 167.97,
  "hfov": 142,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "camera_63B05BF1_6E23_D859_41D9_98EA3FD93442",
 "initialPosition": {
  "yaw": -164.9,
  "hfov": 123,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "id": "camera_7EAB7B84_6E23_D8BE_41CA_B9F7AB030CC5",
 "initialPosition": {
  "yaw": -63.4,
  "hfov": 136,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10
},
{
 "playbackBarHeight": 10,
 "toolTipFontSize": "13px",
 "id": "MainViewer",
 "left": 0,
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadowVerticalLength": 0,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "toolTipTextShadowColor": "#000000",
 "toolTipTextShadowBlurRadius": 3,
 "width": "100%",
 "toolTipFontWeight": "normal",
 "playbackBarRight": 0,
 "toolTipPaddingBottom": 7,
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#00FF00",
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "playbackBarProgressBorderSize": 0,
 "minHeight": 50,
 "playbackBarBorderRadius": 0,
 "transitionDuration": 500,
 "paddingRight": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderRadius": 0,
 "height": "100%",
 "toolTipFontStyle": "normal",
 "minWidth": 100,
 "paddingLeft": 0,
 "progressLeft": 0,
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipShadowOpacity": 0,
 "borderSize": 0,
 "propagateClick": true,
 "toolTipTextShadowOpacity": 0,
 "vrPointerSelectionColor": "#FF6600",
 "class": "ViewerArea",
 "playbackBarBorderSize": 0,
 "toolTipFontFamily": "Georgia",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "playbackBarBackgroundOpacity": 1,
 "shadow": false,
 "progressRight": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "vrPointerSelectionTime": 2000,
 "progressBarBackgroundColorDirection": "vertical",
 "progressBottom": 0,
 "toolTipBackgroundColor": "#000000",
 "toolTipFontColor": "#FFFFFF",
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "playbackBarHeadShadowOpacity": 0.7,
 "vrPointerColor": "#FFFFFF",
 "transitionMode": "blending",
 "progressBarOpacity": 1,
 "playbackBarBorderColor": "#FFFFFF",
 "toolTipBorderSize": 1,
 "toolTipPaddingRight": 10,
 "progressBorderSize": 0,
 "toolTipPaddingLeft": 10,
 "toolTipPaddingTop": 7,
 "toolTipDisplayTime": 600,
 "progressBorderRadius": 0,
 "top": 0,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarLeft": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBorderColor": "#0066FF",
 "paddingBottom": 0,
 "paddingTop": 0,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadOpacity": 1,
 "playbackBarBottom": 5,
 "progressBackgroundColorDirection": "vertical",
 "toolTipShadowSpread": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipBorderColor": "#767676",
 "progressBorderColor": "#FFFFFF",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "data": {
  "name": "Main Viewer"
 },
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipShadowBlurRadius": 3,
 "toolTipOpacity": 0.5
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_22BBC2F4_3075_D173_41B4_71F7A3560C34",
  "this.Container_22BBD2F4_3075_D173_41B4_8504C593E6BF",
  "this.Label_22BB22F4_3075_D173_41BB_3ACDC6CCCC83",
  "this.Label_22BB32F4_3075_D173_4191_C8B45B85DEB8"
 ],
 "id": "Container_22BB12F4_3075_D173_4184_EC3BC4955417",
 "left": 70,
 "scrollBarMargin": 2,
 "width": 550,
 "contentOpaque": false,
 "layout": "absolute",
 "creationPolicy": "inAdvance",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "top": 34,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 140,
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "--STICKER"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "visible": false,
 "overflow": "visible",
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_EF8F8BD8_E386_8E02_41E5_FC5C5513733A",
  "this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE"
 ],
 "id": "Container_EF8F8BD8_E386_8E03_41E3_4CF7CC1F4D8E",
 "scrollBarMargin": 2,
 "width": 115.05,
 "contentOpaque": false,
 "right": "0%",
 "layout": "absolute",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "top": "0%",
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 641,
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "-- SETTINGS"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4",
  "this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD"
 ],
 "id": "Container_4041C033_7558_FB6E_41CE_BFE427F3AF92",
 "left": "0%",
 "scrollBarMargin": 2,
 "width": 330,
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "top": "0%",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "--- LEFT PANEL 4 (Community)"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_062A782F_1140_E20B_41AF_B3E5DE341773",
  "this.Container_062A9830_1140_E215_41A7_5F2BBE5C20E4"
 ],
 "id": "Container_062AB830_1140_E215_41AF_6C9D65345420",
 "left": "0%",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "layout": "absolute",
 "creationPolicy": "inAdvance",
 "right": "0%",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "bottom": "0%",
 "top": "0%",
 "backgroundOpacity": 0.6,
 "minWidth": 1,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "paddingLeft": 0,
 "borderRadius": 0,
 "paddingTop": 0,
 "click": "this.setComponentVisibility(this.Container_062AB830_1140_E215_41AF_6C9D65345420, false, 0, null, null, false)",
 "paddingBottom": 0,
 "gap": 10,
 "class": "Container",
 "borderSize": 0,
 "propagateClick": true,
 "overflow": "scroll",
 "scrollBarColor": "#000000",
 "backgroundColorRatios": [
  0,
  1
 ],
 "data": {
  "name": "--INFO photo"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "visible": false,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_39A197B1_0C06_62AF_419A_D15E4DDD2528"
 ],
 "id": "Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15",
 "left": "0%",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "layout": "absolute",
 "creationPolicy": "inAdvance",
 "right": "0%",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "bottom": "0%",
 "top": "0%",
 "backgroundOpacity": 0.6,
 "minWidth": 1,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "paddingLeft": 0,
 "borderRadius": 0,
 "paddingTop": 0,
 "click": "this.setComponentVisibility(this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15, false, 0, null, null, false)",
 "paddingBottom": 0,
 "gap": 10,
 "class": "Container",
 "borderSize": 0,
 "propagateClick": true,
 "overflow": "scroll",
 "scrollBarColor": "#000000",
 "backgroundColorRatios": [
  0,
  1
 ],
 "data": {
  "name": "--PANORAMA LIST"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "visible": false,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_221C1648_0C06_E5FD_4180_8A2E8B66315E",
  "this.Container_221B3648_0C06_E5FD_4199_FCE031AE003B"
 ],
 "id": "Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7",
 "left": "0%",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "layout": "absolute",
 "creationPolicy": "inAdvance",
 "right": "0%",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "bottom": "0%",
 "top": "0%",
 "backgroundOpacity": 0.6,
 "minWidth": 1,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "paddingLeft": 0,
 "borderRadius": 0,
 "paddingTop": 0,
 "click": "this.setComponentVisibility(this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7, false, 0, null, null, false)",
 "paddingBottom": 0,
 "gap": 10,
 "class": "Container",
 "borderSize": 0,
 "propagateClick": true,
 "overflow": "scroll",
 "scrollBarColor": "#000000",
 "backgroundColorRatios": [
  0,
  1
 ],
 "data": {
  "name": "--LOCATION"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "visible": false,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_2F8A6686_0D4F_6B71_4174_A02FE43588D3"
 ],
 "id": "Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41",
 "left": "0%",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "layout": "absolute",
 "creationPolicy": "inAdvance",
 "right": "0%",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "bottom": "0%",
 "top": "0%",
 "backgroundOpacity": 0.6,
 "minWidth": 1,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "paddingLeft": 0,
 "borderRadius": 0,
 "paddingTop": 0,
 "click": "this.setComponentVisibility(this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41, false, 0, null, null, false)",
 "paddingBottom": 0,
 "gap": 10,
 "class": "Container",
 "borderSize": 0,
 "propagateClick": true,
 "overflow": "scroll",
 "scrollBarColor": "#000000",
 "backgroundColorRatios": [
  0,
  1
 ],
 "data": {
  "name": "--FLOORPLAN"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "visible": false,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_2A193C4C_0D3B_DFF0_4161_A2CD128EF536"
 ],
 "id": "Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E",
 "left": "0%",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "layout": "absolute",
 "creationPolicy": "inAdvance",
 "right": "0%",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "bottom": "0%",
 "top": "0%",
 "backgroundOpacity": 0.6,
 "minWidth": 1,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "paddingLeft": 0,
 "borderRadius": 0,
 "paddingTop": 0,
 "click": "this.setComponentVisibility(this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E, false, 0, null, null, false)",
 "paddingBottom": 0,
 "gap": 10,
 "class": "Container",
 "borderSize": 0,
 "propagateClick": true,
 "overflow": "scroll",
 "scrollBarColor": "#000000",
 "backgroundColorRatios": [
  0,
  1
 ],
 "data": {
  "name": "--PHOTOALBUM"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "visible": false,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_1E19923C_57F1_802D_41C4_18DBE75E48C1",
  "this.Container_1E18A23C_57F1_802D_41B9_D08FA26C7F4C"
 ],
 "id": "Container_1E18823C_57F1_802D_41C1_C325A6BB2CA9",
 "left": "0%",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "layout": "absolute",
 "creationPolicy": "inAdvance",
 "right": "0%",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "bottom": "0%",
 "top": "0%",
 "backgroundOpacity": 0.6,
 "minWidth": 1,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "paddingLeft": 0,
 "borderRadius": 0,
 "paddingTop": 0,
 "click": "this.setComponentVisibility(this.Container_1E18823C_57F1_802D_41C1_C325A6BB2CA9, false, 0, null, null, false)",
 "paddingBottom": 0,
 "gap": 10,
 "class": "Container",
 "borderSize": 0,
 "propagateClick": true,
 "overflow": "scroll",
 "scrollBarColor": "#04A3E1",
 "backgroundColorRatios": [
  0,
  1
 ],
 "data": {
  "name": "--REALTOR"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "visible": false,
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "center",
 "maxHeight": 58,
 "maxWidth": 58,
 "id": "IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0",
 "width": 58,
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "height": 58,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "toggle",
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "propagateClick": true,
 "iconURL": "skin/IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0.png",
 "paddingBottom": 0,
 "class": "IconButton",
 "borderSize": 0,
 "transparencyActive": true,
 "data": {
  "name": "IconButton FULLSCREEN"
 },
 "shadow": false,
 "pressedIconURL": "skin/IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0_pressed.png",
 "cursor": "hand"
},
{
 "horizontalAlign": "center",
 "maxHeight": 58,
 "maxWidth": 58,
 "id": "IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D",
 "width": 58,
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "height": 58,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "toggle",
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "propagateClick": true,
 "iconURL": "skin/IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D.png",
 "paddingBottom": 0,
 "class": "IconButton",
 "borderSize": 0,
 "transparencyActive": true,
 "data": {
  "name": "IconButton MUTE"
 },
 "shadow": false,
 "pressedIconURL": "skin/IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D_pressed.png",
 "cursor": "hand"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 15.91,
   "yaw": 16.61,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0_HS_1_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -23.8
  }
 ],
 "data": {
  "label": "Ir: Piscina 2"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6, this.camera_63F93C2B_6E23_DFC9_41D0_447D3FA69909); this.mainPlayList.set('selectedIndex', 13)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_4DB1CE2D_609D_D1BB_41D0_2CC73BF04601",
   "hfov": 15.91,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -23.8,
   "yaw": 16.61,
   "distance": 100
  }
 ],
 "id": "overlay_45475AE9_608C_56BB_41B3_D29FE1C2A7CA",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 16,
   "yaw": 97,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0_HS_2_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -23.05
  }
 ],
 "data": {
  "label": "Ir: Sinuca"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 8)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_453421DE_608F_D299_41B0_0E45978AC23F",
   "hfov": 16,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -23.05,
   "yaw": 97,
   "distance": 100
  }
 ],
 "id": "overlay_46C8F6AD_608C_3EBB_41D8_292FE30FDA53",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 26.31,
   "yaw": 150.71,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0_HS_3_0_0_map.gif",
      "width": 26,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -34.34
  }
 ],
 "data": {
  "label": "Ir: Entrada (Subida 2)"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 14)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_46DEB04F_6084_D1F7_41CF_18899D95E0F6",
   "hfov": 26.31,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -34.34,
   "yaw": 150.71,
   "distance": 50
  }
 ],
 "id": "overlay_45155781_6084_7F6B_41B6_6BD2FF7F3061",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 10.16,
   "yaw": -82.75,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -49.46
  }
 ],
 "data": {
  "label": "Ir: Parquinho 2"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8, this.camera_7ED1ABB7_6E23_D8DA_41BE_863C5F9C4D27); this.mainPlayList.set('selectedIndex', 9)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_4DB01E2D_609D_D1BB_41C0_7838C2D0C118",
   "hfov": 10.16,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -49.46,
   "yaw": -82.75,
   "distance": 100
  }
 ],
 "id": "overlay_473C5C2C_609C_51BA_41BD_8613B7AD5DD7",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 14.26,
   "yaw": -146.56,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -24.09
  }
 ],
 "data": {
  "label": "Avan\u00e7ar: Entrada (Subida 1)"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 15)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_45FE1B38_609C_5799_41BF_5DE5A8A5E2EE",
   "hfov": 14.26,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -24.09,
   "yaw": -146.56,
   "distance": 100
  }
 ],
 "id": "overlay_41B4FB78_609C_379A_41CD_2B297351E097",
 "class": "HotspotPanoramaOverlay"
},
{
 "horizontalAlign": "center",
 "maxHeight": 58,
 "maxWidth": 58,
 "id": "IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB",
 "width": 58,
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "height": 58,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB_rollover.png",
 "propagateClick": true,
 "iconURL": "skin/IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB.png",
 "paddingBottom": 0,
 "class": "IconButton",
 "borderSize": 0,
 "transparencyActive": true,
 "data": {
  "name": "IconButton VR"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "horizontalAlign": "center",
 "maxHeight": 58,
 "maxWidth": 58,
 "id": "IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96",
 "width": 58,
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "height": 58,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "toggle",
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "propagateClick": true,
 "iconURL": "skin/IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96.png",
 "paddingBottom": 0,
 "class": "IconButton",
 "borderSize": 0,
 "transparencyActive": true,
 "data": {
  "name": "IconButton HS "
 },
 "shadow": false,
 "pressedIconURL": "skin/IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96_pressed.png",
 "cursor": "hand"
},
{
 "horizontalAlign": "center",
 "maxHeight": 58,
 "maxWidth": 58,
 "id": "IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A",
 "width": 58,
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "height": 58,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "toggle",
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "propagateClick": true,
 "iconURL": "skin/IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A.png",
 "paddingBottom": 0,
 "class": "IconButton",
 "borderSize": 0,
 "transparencyActive": true,
 "data": {
  "name": "IconButton GYRO"
 },
 "shadow": false,
 "pressedIconURL": "skin/IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A_pressed.png",
 "cursor": "hand"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 13.65,
   "yaw": 136.56,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0_HS_0_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -29.11
  }
 ],
 "data": {
  "label": "Ir: Sinuca"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 8)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5B596D55_6185_F3EB_41C6_471FA34B4843",
   "hfov": 13.65,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -29.11,
   "yaw": 136.56,
   "distance": 100
  }
 ],
 "id": "overlay_571F7629_6183_D1BB_41D7_4247766AA1CE",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 14.43,
   "yaw": -99.21,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -41.93
  }
 ],
 "data": {
  "label": "Ir: Quarto (Sinuca 2)"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 6)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5B593D55_6185_F3EB_41D5_C3A506493EE2",
   "hfov": 14.43,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -41.93,
   "yaw": -99.21,
   "distance": 100
  }
 ],
 "id": "overlay_57390319_6184_D79B_41B9_4A6B8D7CE925",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 13.26,
   "yaw": -46.82,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0_HS_0_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -46.16
  }
 ],
 "data": {
  "label": "Ir: Sinuca"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 8)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_55D1B2A3_617C_36AF_41CC_4C89BED10068",
   "hfov": 13.26,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -46.16,
   "yaw": -46.82,
   "distance": 100
  }
 ],
 "id": "overlay_4EAC6CB4_617C_D2A9_41D3_BCC38DC7A475",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 12.64,
   "yaw": 116.6,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0_HS_1_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -43.4
  }
 ],
 "data": {
  "label": "Ir: Quarto (Sinuca 2)"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65, this.camera_7EF3ABA9_6E23_D8F6_41D4_6E5DB8BED751); this.mainPlayList.set('selectedIndex', 6)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_55D102A4_617C_36A9_41C1_76D2FD78D8F7",
   "hfov": 12.64,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -43.4,
   "yaw": 116.6,
   "distance": 100
  }
 ],
 "id": "overlay_4EA66959_617D_D39B_41D5_14F977BE6124",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 15.31,
   "yaw": 67.86,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0_HS_0_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -28.33
  }
 ],
 "data": {
  "label": "Ir: Parquinho 3"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86, this.camera_63EFFC24_6E23_DFFF_41C7_8A4E2890E0F9); this.mainPlayList.set('selectedIndex', 11)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_4E5CEABB_608C_F69F_41C1_B59FCF6B9696",
   "hfov": 15.31,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -28.33,
   "yaw": 67.86,
   "distance": 100
  }
 ],
 "id": "overlay_4BF10C17_6084_7195_41BF_573AB1FC3C1C",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 13.87,
   "yaw": -90.66,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0_HS_1_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -37.12
  }
 ],
 "data": {
  "label": "Ir: Parquinho 1"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A, this.camera_63E4CC1D_6E23_DFC9_41CF_92F7BA7A8567); this.mainPlayList.set('selectedIndex', 10)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_4E5C9ABB_608C_F69F_41CA_F4640DECC583",
   "hfov": 13.87,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -37.12,
   "yaw": -90.66,
   "distance": 100
  }
 ],
 "id": "overlay_4BAA53FE_608C_5699_41C6_D7B378EF74EB",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 13.6,
   "yaw": -45.69,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0_HS_0_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -50.56
  }
 ],
 "data": {
  "label": "Ir: Quarto (Sinuca 1)"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6BC659E9_608C_32BB_41D1_365F5B17814C, this.camera_7EAB7B84_6E23_D8BE_41CA_B9F7AB030CC5); this.mainPlayList.set('selectedIndex', 7)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_58FACE03_618C_516F_41D5_53ABF63DFBB2",
   "hfov": 13.6,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -50.56,
   "yaw": -45.69,
   "distance": 100
  }
 ],
 "id": "overlay_5121D802_6184_5169_41D1_5C2831E37815",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 11.63,
   "yaw": 160.43,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0_HS_3_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -41.93
  }
 ],
 "data": {
  "label": "Ir: Quarto (Sinuca 3)"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F, this.camera_7EB6EB8D_6E23_D8CE_41D8_74312234EFA4); this.mainPlayList.set('selectedIndex', 3)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_58FA2E03_618C_516F_41D0_BE2BAE1EC91E",
   "hfov": 11.63,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -41.93,
   "yaw": 160.43,
   "distance": 100
  }
 ],
 "id": "overlay_52286732_618C_7FA9_4164_11A432ED0F5C",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 10.72,
   "yaw": -157.62,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0_HS_4_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -46.7
  }
 ],
 "data": {
  "label": "Ir: Lateral"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 5)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_58FB9E03_618C_516F_41AC_C41F5F5835F6",
   "hfov": 10.72,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -46.7,
   "yaw": -157.62,
   "distance": 100
  }
 ],
 "id": "overlay_525B547B_618C_719F_41D2_4C4E4CEC47FE",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 15.41,
   "yaw": 82.56,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0_HS_0_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -40.13
  }
 ],
 "data": {
  "label": "Ir: Quarto (Piscina/Churrasqueira)"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 2)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_23BE94CF_619D_D2F7_41C9_E0B68A99E52F",
   "hfov": 15.41,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -40.13,
   "yaw": 82.56,
   "distance": 100
  }
 ],
 "id": "overlay_59C5365B_619D_D19F_41BD_B11F68911E23",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 13.3,
   "yaw": -57,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0_HS_1_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -40.13
  }
 ],
 "data": {
  "label": "Ir: Quarto (Sinuca 3)"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F, this.camera_7EDF7BBE_6E23_D8CA_4194_BF8E70B941BB); this.mainPlayList.set('selectedIndex', 3)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5A0586A7_619C_FEB7_41D3_E10EEABD3A5B",
   "hfov": 13.3,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -40.13,
   "yaw": -57,
   "distance": 100
  }
 ],
 "id": "overlay_59E1BA5B_619C_519F_41BF_A03BDDCF3357",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 16.94,
   "yaw": -167.66,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0_HS_0_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -27.82
  }
 ],
 "data": {
  "label": "Ir: Piscina 1"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0, this.camera_639A8C16_6E23_DFDB_41D5_F67C8B6C6C05); this.mainPlayList.set('selectedIndex', 12)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_2496019E_61BC_3299_41B9_11E04CD42336",
   "hfov": 16.94,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -27.82,
   "yaw": -167.66,
   "distance": 100
  }
 ],
 "id": "overlay_5EDFDEE2_61BF_CEA9_41C3_CCB6A398007B",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 13.73,
   "yaw": 15.1,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0_HS_1_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -37.87
  }
 ],
 "data": {
  "label": "Ir: Churrasqueira"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466, this.camera_63917C0F_6E23_DFC9_41C6_71E1A531D0A6); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_2496F19E_61BC_3299_41C7_93BCCEEF5629",
   "hfov": 13.73,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -37.87,
   "yaw": 15.1,
   "distance": 100
  }
 ],
 "id": "overlay_21220603_61BC_D16F_41A1_22A3AA930273",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 15.56,
   "yaw": -149.2,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0_HS_0_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -26.57
  }
 ],
 "data": {
  "label": "Ir: Piscina 2"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6, this.camera_63B05BF1_6E23_D859_41D9_98EA3FD93442); this.mainPlayList.set('selectedIndex', 13)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5E8ECC9C_6184_7299_419F_27B4C0E3E8AF",
   "hfov": 15.56,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -26.57,
   "yaw": -149.2,
   "distance": 100
  }
 ],
 "id": "overlay_5C429145_6184_33EB_41C7_A76E66937BA4",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 15.42,
   "yaw": 92.23,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0_HS_1_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -27.57
  }
 ],
 "data": {
  "label": "Ir: Parquinho 1"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A, this.camera_63B44BF9_6E23_D849_41D5_4579FBA18D4B); this.mainPlayList.set('selectedIndex', 10)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5E8E1C9C_6184_7299_41CD_149529B075D3",
   "hfov": 15.42,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -27.57,
   "yaw": 92.23,
   "distance": 100
  }
 ],
 "id": "overlay_5C4F9703_6184_DF6F_41A4_FAB3865DC610",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 13.82,
   "yaw": -57.5,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0_HS_0_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -37.37
  }
 ],
 "data": {
  "label": "Ir: Churrasqueira"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466, this.camera_7E957B9B_6E23_D8CA_41D3_5DD14F43FE93); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_4BD7A79E_6084_5E99_41C2_8FEF9DB6C1A4",
   "hfov": 13.82,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -37.37,
   "yaw": -57.5,
   "distance": 100
  }
 ],
 "id": "overlay_48F5B6DA_609C_5E99_41BC_E60BC39B686F",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 15.45,
   "yaw": 134.18,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0_HS_1_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -27.32
  }
 ],
 "data": {
  "label": "Ir: Parquinho 2"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8, this.camera_7EE21BA2_6E23_D8FA_41D5_4C9266B27358); this.mainPlayList.set('selectedIndex', 9)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_4BD7D79F_6084_5E97_41C1_BD8EB0C29144",
   "hfov": 15.45,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -27.32,
   "yaw": 134.18,
   "distance": 100
  }
 ],
 "id": "overlay_48CC19BA_609C_5299_41D0_741742112F65",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 14.61,
   "yaw": -130.35,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0_HS_1_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -32.85
  }
 ],
 "data": {
  "label": "Ir: Entrada"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 0)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_4568C514_6084_3369_41A8_78052BFEA85B",
   "hfov": 14.61,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -32.85,
   "yaw": -130.35,
   "distance": 100
  }
 ],
 "id": "overlay_41A3A182_6085_D369_41D4_8B3AD297B618",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 14.63,
   "yaw": 42.86,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0_HS_2_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": 0.44
  }
 ],
 "data": {
  "label": "Ir: Entrada (Subida 2)"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484, this.camera_7EC0DBB0_6E23_D8D6_41D8_C802D3D34441); this.mainPlayList.set('selectedIndex', 14)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_42ACCCFA_6084_3299_41C6_8717C0C8C055",
   "hfov": 14.63,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": 0.44,
   "yaw": 42.86,
   "distance": 100
  }
 ],
 "id": "overlay_487C8BD1_608C_56EB_41A2_52F20A8FAAE3",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 15.42,
   "yaw": -133.62,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0_HS_0_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -27.57
  }
 ],
 "data": {
  "label": "Ir: Piscina 2"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 13)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5E899C9C_6184_7299_41CD_2932F3DB2D34",
   "hfov": 15.42,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -27.57,
   "yaw": -133.62,
   "distance": 100
  }
 ],
 "id": "overlay_5D2A6A2F_6184_71B7_41B6_BAA90A4D942C",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 14.93,
   "yaw": 65.35,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0_HS_1_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -30.84
  }
 ],
 "data": {
  "label": "Ir: Quarto (Sinuca 4)"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 4)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5F4AF1AC_618C_32B9_41D1_09B874BC3B43",
   "hfov": 14.93,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -30.84,
   "yaw": 65.35,
   "distance": 100
  }
 ],
 "id": "overlay_5DB2970A_6183_FF7E_41D3_F5F4414F7269",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 13.91,
   "yaw": -12.03,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0_HS_0_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -36.87
  }
 ],
 "data": {
  "label": "Ir: Quarto (Sinuca 2)"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65, this.camera_63BD6C01_6E23_DFB9_41D5_D807AC513648); this.mainPlayList.set('selectedIndex', 6)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5A3D90BD_6185_F29B_41D3_C5E760D54ED0",
   "hfov": 13.91,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -36.87,
   "yaw": -12.03,
   "distance": 100
  }
 ],
 "id": "overlay_58B6D525_6183_D3AB_41CA_DF4615F0F4AF",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 12.53,
   "yaw": 155.53,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0_HS_1_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -43.9
  }
 ],
 "data": {
  "label": "Ir: Quarto (Sinuca 4)"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6BBC953E_608C_D399_4188_6D733FA23DA5, this.camera_63872C08_6E23_DFB7_41C8_AD3F6844A9BD); this.mainPlayList.set('selectedIndex', 4)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5F4B21AC_618C_32B9_41BC_F38051E2A683",
   "hfov": 12.53,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -43.9,
   "yaw": 155.53,
   "distance": 100
  }
 ],
 "id": "overlay_58B070BA_6184_D299_417D_43DE9D81A59E",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 12.69,
   "yaw": -30.12,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0_HS_0_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -43.15
  }
 ],
 "data": {
  "label": "Ir: Entrada (Subida 1)"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_6BDDB18C_608C_3379_41D0_4888B6706F93, this.camera_7E87BB94_6E23_D8DE_41B4_B7682A9C00DF); this.mainPlayList.set('selectedIndex', 15)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_476272D0_60BF_D6E9_41AC_69C7274112C1",
   "hfov": 12.69,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -43.15,
   "yaw": -30.12,
   "distance": 100
  }
 ],
 "id": "overlay_43F52718_6084_5F99_41CE_E7B49771F064",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 14.29,
   "yaw": 144.1,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0_HS_1_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -23.84
  }
 ],
 "data": {
  "label": "Ir: Piscina 1"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 12)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_444AC909_60BC_737B_41B3_951F4CF380CD",
   "hfov": 14.29,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -23.84,
   "yaw": 144.1,
   "distance": 100
  }
 ],
 "id": "overlay_43FDB33C_60BC_7799_41D4_54B45407D00B",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 15.79,
   "yaw": -175.32,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0_HS_2_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -24.81
  }
 ],
 "data": {
  "label": "Ir: Piscina 1"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 12)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_55D38F06_6084_CF69_41AC_9051F223E6E2",
   "hfov": 15.79,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -24.81,
   "yaw": -175.32,
   "distance": 100
  }
 ],
 "id": "overlay_4E943164_608C_53A9_41AC_0DE7E0F8B63E",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 12.41,
   "yaw": -49.34,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0_HS_3_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -37.4
  }
 ],
 "data": {
  "label": "Ir: Lateral"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 5)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_51579D36_6085_D3A9_41BC_33EEA669F83F",
   "hfov": 12.41,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -37.4,
   "yaw": -49.34,
   "distance": 100
  }
 ],
 "id": "overlay_4E162BCB_6087_D6FE_41D6_689D77202A98",
 "class": "HotspotPanoramaOverlay"
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "hfov": 12.78,
   "yaw": -133.25,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0_HS_4_0_0_map.gif",
      "width": 27,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -35.14
  }
 ],
 "data": {
  "label": "Ir: Quarto (Sinuca 1)"
 },
 "rollOverDisplay": false,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 7)",
   "class": "HotspotPanoramaOverlayArea",
   "toolTip": "Clique/Toque para avan\u00e7ar"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_51571D36_6085_D3A9_41CC_5ED1596264AD",
   "hfov": 12.78,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -35.14,
   "yaw": -133.25,
   "distance": 100
  }
 ],
 "id": "overlay_4FE11FC7_6084_4EF7_41D5_53970B41910A",
 "class": "HotspotPanoramaOverlay"
},
{
 "horizontalAlign": "left",
 "id": "Container_22BBC2F4_3075_D173_41B4_71F7A3560C34",
 "left": "0%",
 "scrollBarMargin": 2,
 "shadowVerticalLength": 0,
 "width": 366,
 "shadowColor": "#000000",
 "contentOpaque": false,
 "layout": "absolute",
 "shadowBlurRadius": 7,
 "shadowSpread": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "minHeight": 1,
 "height": 78,
 "backgroundOpacity": 1,
 "minWidth": 1,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "top": 2,
 "shadowOpacity": 0.3,
 "paddingLeft": 0,
 "borderRadius": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "shadowHorizontalLength": 0,
 "data": {
  "name": "white block"
 },
 "shadow": true,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "id": "Container_22BBD2F4_3075_D173_41B4_8504C593E6BF",
 "left": 0,
 "scrollBarMargin": 2,
 "shadowVerticalLength": 0,
 "width": 366,
 "shadowColor": "#000000",
 "contentOpaque": false,
 "layout": "absolute",
 "shadowBlurRadius": 7,
 "shadowSpread": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "minHeight": 1,
 "height": 46,
 "backgroundOpacity": 1,
 "minWidth": 1,
 "backgroundColor": [
  "#5CA1DE"
 ],
 "top": 86,
 "shadowOpacity": 0.3,
 "paddingLeft": 0,
 "borderRadius": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0.01
 ],
 "scrollBarColor": "#000000",
 "shadowHorizontalLength": 0,
 "data": {
  "name": "blue block"
 },
 "shadow": true,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "fontColor": "#000000",
 "id": "Label_22BB22F4_3075_D173_41BB_3ACDC6CCCC83",
 "left": 10,
 "width": 391,
 "text": "LOREM IPSUM",
 "minHeight": 1,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "top": 0,
 "paddingLeft": 0,
 "fontSize": 61,
 "fontFamily": "Oswald",
 "paddingTop": 0,
 "propagateClick": true,
 "height": 75,
 "paddingBottom": 0,
 "fontStyle": "italic",
 "class": "Label",
 "borderSize": 0,
 "data": {
  "name": "text 1"
 },
 "shadow": false,
 "fontWeight": "bold",
 "textDecoration": "none"
},
{
 "horizontalAlign": "left",
 "fontColor": "#FFFFFF",
 "id": "Label_22BB32F4_3075_D173_4191_C8B45B85DEB8",
 "left": 12,
 "width": 385,
 "textShadowVerticalLength": 0,
 "textShadowColor": "#000000",
 "text": "DOLOR SIT AMET, CONSECTETUR",
 "minHeight": 1,
 "verticalAlign": "top",
 "textShadowHorizontalLength": 0,
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "top": 90,
 "textShadowBlurRadius": 10,
 "paddingLeft": 0,
 "fontSize": 28,
 "fontFamily": "Oswald",
 "paddingTop": 0,
 "propagateClick": true,
 "height": 44,
 "paddingBottom": 0,
 "fontStyle": "italic",
 "class": "Label",
 "borderSize": 0,
 "data": {
  "name": "text 2"
 },
 "shadow": false,
 "fontWeight": "normal",
 "textShadowOpacity": 1,
 "textDecoration": "none"
},
{
 "horizontalAlign": "center",
 "children": [
  "this.IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329"
 ],
 "id": "Container_EF8F8BD8_E386_8E02_41E5_FC5C5513733A",
 "scrollBarMargin": 2,
 "width": 110,
 "contentOpaque": false,
 "right": "0%",
 "layout": "horizontal",
 "minHeight": 1,
 "verticalAlign": "middle",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "top": "0%",
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 110,
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "button menu sup"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "visible",
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "center",
 "children": [
  "this.IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB",
  "this.IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A",
  "this.IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D",
  "this.IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96",
  "this.IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0",
  "this.IconButton_EE5807F6_E3BE_860E_41E7_431DDDA54BAC",
  "this.IconButton_EED5213F_E3B9_7A7D_41D8_1B642C004521"
 ],
 "id": "Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE",
 "scrollBarMargin": 2,
 "width": "91.304%",
 "contentOpaque": false,
 "right": "0%",
 "layout": "vertical",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "bottom": "0%",
 "paddingLeft": 0,
 "gap": 3,
 "paddingTop": 0,
 "propagateClick": true,
 "height": "85.959%",
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "-button set"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "visible": false,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_21F34780_3014_BF93_41A2_9BF700588BEC",
  "this.IconButton_223F0171_3014_B375_41C1_61063C3D73B3"
 ],
 "id": "Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4",
 "left": "0%",
 "scrollBarMargin": 2,
 "width": 66,
 "contentOpaque": false,
 "layout": "absolute",
 "creationPolicy": "inAdvance",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "top": "0%",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "height": "100%",
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "- COLLAPSE"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "visible": false,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_4521E58D_74A8_853A_418A_CF7FF914DD83",
  "this.IconButton_1AF35943_2D07_479B_41AF_FBC8A1477882"
 ],
 "id": "Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD",
 "scrollBarMargin": 2,
 "width": 330,
 "contentOpaque": false,
 "right": 0,
 "layout": "absolute",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "top": "0%",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "- EXPANDED"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "visible",
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_062A682F_1140_E20B_41B0_3071FCBF3DC9",
  "this.Container_062A082F_1140_E20A_4193_DF1A4391DC79"
 ],
 "id": "Container_062A782F_1140_E20B_41AF_B3E5DE341773",
 "left": "15%",
 "scrollBarMargin": 2,
 "shadowVerticalLength": 0,
 "shadowColor": "#000000",
 "contentOpaque": false,
 "right": "15%",
 "layout": "horizontal",
 "shadowBlurRadius": 25,
 "shadowSpread": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "shadowOpacity": 0.3,
 "top": "10%",
 "backgroundOpacity": 1,
 "minWidth": 1,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "bottom": "10%",
 "paddingLeft": 0,
 "borderRadius": 0,
 "minHeight": 1,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "shadowHorizontalLength": 0,
 "data": {
  "name": "Global"
 },
 "shadow": true,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "right",
 "children": [
  "this.IconButton_062A8830_1140_E215_419D_3439F16CCB3E"
 ],
 "id": "Container_062A9830_1140_E215_41A7_5F2BBE5C20E4",
 "left": "15%",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "right": "15%",
 "layout": "vertical",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 20,
 "top": "10%",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "bottom": "80%",
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 20,
 "propagateClick": false,
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container X global"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "visible",
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "center",
 "children": [
  "this.Container_3A67552A_0C3A_67BD_4195_ECE46CCB34EA",
  "this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0"
 ],
 "id": "Container_39A197B1_0C06_62AF_419A_D15E4DDD2528",
 "left": "15%",
 "scrollBarMargin": 2,
 "shadowVerticalLength": 0,
 "shadowColor": "#000000",
 "contentOpaque": false,
 "right": "15%",
 "layout": "absolute",
 "shadowBlurRadius": 25,
 "shadowSpread": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "shadowOpacity": 0.3,
 "top": "10%",
 "backgroundOpacity": 1,
 "minWidth": 1,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "bottom": "10%",
 "paddingLeft": 0,
 "borderRadius": 0,
 "minHeight": 1,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "shadowHorizontalLength": 0,
 "data": {
  "name": "Global"
 },
 "shadow": true,
 "scrollBarOpacity": 0.5,
 "overflow": "visible",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.WebFrame_22F9EEFF_0C1A_2293_4165_411D4444EFEA"
 ],
 "id": "Container_221C1648_0C06_E5FD_4180_8A2E8B66315E",
 "left": "15%",
 "scrollBarMargin": 2,
 "shadowVerticalLength": 0,
 "shadowColor": "#000000",
 "contentOpaque": false,
 "right": "15%",
 "layout": "horizontal",
 "shadowBlurRadius": 25,
 "shadowSpread": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "shadowOpacity": 0.3,
 "top": "10%",
 "backgroundOpacity": 1,
 "minWidth": 1,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "bottom": "10%",
 "paddingLeft": 0,
 "borderRadius": 0,
 "minHeight": 1,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "shadowHorizontalLength": 0,
 "data": {
  "name": "Global"
 },
 "shadow": true,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "right",
 "children": [
  "this.IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF"
 ],
 "id": "Container_221B3648_0C06_E5FD_4199_FCE031AE003B",
 "left": "15%",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "right": "15%",
 "layout": "vertical",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "top": "10%",
 "paddingRight": 20,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "bottom": "80%",
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 20,
 "propagateClick": true,
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container X global"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "visible",
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "center",
 "children": [
  "this.MapViewer",
  "this.Container_2F8A7686_0D4F_6B71_41A9_1A894413085C"
 ],
 "id": "Container_2F8A6686_0D4F_6B71_4174_A02FE43588D3",
 "left": "15%",
 "scrollBarMargin": 2,
 "shadowVerticalLength": 0,
 "shadowColor": "#000000",
 "contentOpaque": false,
 "right": "15%",
 "layout": "absolute",
 "shadowBlurRadius": 25,
 "shadowSpread": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "shadowOpacity": 0.3,
 "top": "10%",
 "backgroundOpacity": 1,
 "minWidth": 1,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "bottom": "10%",
 "paddingLeft": 0,
 "borderRadius": 0,
 "minHeight": 1,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "shadowHorizontalLength": 0,
 "data": {
  "name": "Global"
 },
 "shadow": true,
 "scrollBarOpacity": 0.5,
 "overflow": "visible",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "center",
 "children": [
  "this.Container_2A19EC4C_0D3B_DFF0_414D_37145C22C5BC"
 ],
 "id": "Container_2A193C4C_0D3B_DFF0_4161_A2CD128EF536",
 "left": "15%",
 "scrollBarMargin": 2,
 "shadowVerticalLength": 0,
 "shadowColor": "#000000",
 "contentOpaque": false,
 "right": "15%",
 "layout": "vertical",
 "shadowBlurRadius": 25,
 "shadowSpread": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "shadowOpacity": 0.3,
 "top": "10%",
 "backgroundOpacity": 1,
 "minWidth": 1,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "bottom": "10%",
 "paddingLeft": 0,
 "borderRadius": 0,
 "minHeight": 1,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "shadowHorizontalLength": 0,
 "data": {
  "name": "Global"
 },
 "shadow": true,
 "scrollBarOpacity": 0.5,
 "overflow": "visible",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_1E19E23C_57F1_802D_41D1_9B8B4D1D2BBD",
  "this.Container_1E19D23C_57F1_802D_41B0_92437DF80B82"
 ],
 "id": "Container_1E19923C_57F1_802D_41C4_18DBE75E48C1",
 "left": "15%",
 "scrollBarMargin": 2,
 "shadowVerticalLength": 0,
 "shadowColor": "#000000",
 "contentOpaque": false,
 "right": "15%",
 "layout": "horizontal",
 "shadowBlurRadius": 25,
 "shadowSpread": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "shadowOpacity": 0.3,
 "top": "10%",
 "backgroundOpacity": 1,
 "minWidth": 1,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "bottom": "10%",
 "paddingLeft": 0,
 "borderRadius": 0,
 "minHeight": 1,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "shadowHorizontalLength": 0,
 "data": {
  "name": "Global"
 },
 "shadow": true,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "right",
 "children": [
  "this.IconButton_1E18B23C_57F1_802D_41C8_61C0F9BCC1FF"
 ],
 "id": "Container_1E18A23C_57F1_802D_41B9_D08FA26C7F4C",
 "left": "15%",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "right": "15%",
 "layout": "vertical",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 20,
 "top": "10%",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "bottom": "80%",
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 20,
 "propagateClick": false,
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container X global"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "visible",
 "scrollBarVisible": "rollOver"
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 780
  }
 ],
 "id": "AnimatedImageResource_4DB1CE2D_609D_D1BB_41D0_2CC73BF04601",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 780
  }
 ],
 "id": "AnimatedImageResource_453421DE_608F_D299_41B0_0E45978AC23F",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BBD8D3E_608C_7399_41CB_D9A1136403F0_0_HS_3_0.png",
   "width": 1220,
   "class": "ImageResourceLevel",
   "height": 1110
  }
 ],
 "id": "AnimatedImageResource_46DEB04F_6084_D1F7_41CF_18899D95E0F6",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BDE163D_608C_719B_41D0_DB3BD00DBF86_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 1050
  }
 ],
 "id": "AnimatedImageResource_4DB01E2D_609D_D1BB_41C0_7838C2D0C118",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6C94778D_608C_DF7B_41B8_AA2C05FB6E36_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 1050
  }
 ],
 "id": "AnimatedImageResource_45FE1B38_609C_5799_41BF_5DE5A8A5E2EE",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 1050
  }
 ],
 "id": "AnimatedImageResource_5B596D55_6185_F3EB_41C6_471FA34B4843",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BC09C00_608C_D16A_41D7_23489B5CF2A0_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 1050
  }
 ],
 "id": "AnimatedImageResource_5B593D55_6185_F3EB_41D5_C3A506493EE2",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 780
  }
 ],
 "id": "AnimatedImageResource_55D1B2A3_617C_36AF_41CC_4C89BED10068",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BC659E9_608C_32BB_41D1_365F5B17814C_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 780
  }
 ],
 "id": "AnimatedImageResource_55D102A4_617C_36A9_41C1_76D2FD78D8F7",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 780
  }
 ],
 "id": "AnimatedImageResource_4E5CEABB_608C_F69F_41C1_B59FCF6B9696",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BC557E5_608C_5EAB_41BF_46E3C9FD25D8_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 780
  }
 ],
 "id": "AnimatedImageResource_4E5C9ABB_608C_F69F_41CA_F4640DECC583",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 780
  }
 ],
 "id": "AnimatedImageResource_58FACE03_618C_516F_41D5_53ABF63DFBB2",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0_HS_3_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 1050
  }
 ],
 "id": "AnimatedImageResource_58FA2E03_618C_516F_41D0_BE2BAE1EC91E",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BBD8308_608C_3779_41A3_046A0E4FDA65_0_HS_4_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 1050
  }
 ],
 "id": "AnimatedImageResource_58FB9E03_618C_516F_41AC_C41F5F5835F6",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 780
  }
 ],
 "id": "AnimatedImageResource_23BE94CF_619D_D2F7_41C9_E0B68A99E52F",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BBC953E_608C_D399_4188_6D733FA23DA5_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 780
  }
 ],
 "id": "AnimatedImageResource_5A0586A7_619C_FEB7_41D3_E10EEABD3A5B",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 780
  }
 ],
 "id": "AnimatedImageResource_2496019E_61BC_3299_41B9_11E04CD42336",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BC513F7_608C_5697_41D6_0E0E99E532E6_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 780
  }
 ],
 "id": "AnimatedImageResource_2496F19E_61BC_3299_41C7_93BCCEEF5629",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 780
  }
 ],
 "id": "AnimatedImageResource_5E8ECC9C_6184_7299_419F_27B4C0E3E8AF",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BB060A4_608C_F2AA_41C3_668FD7D8B466_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 780
  }
 ],
 "id": "AnimatedImageResource_5E8E1C9C_6184_7299_41CD_149529B075D3",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 780
  }
 ],
 "id": "AnimatedImageResource_4BD7A79E_6084_5E99_41C2_8FEF9DB6C1A4",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BBDBF4E_608C_4FF9_41C9_E7C95BBF399A_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 780
  }
 ],
 "id": "AnimatedImageResource_4BD7D79F_6084_5E97_41C1_BD8EB0C29144",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 780
  }
 ],
 "id": "AnimatedImageResource_4568C514_6084_3369_41A8_78052BFEA85B",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BDDB18C_608C_3379_41D0_4888B6706F93_0_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 780
  }
 ],
 "id": "AnimatedImageResource_42ACCCFA_6084_3299_41C6_8717C0C8C055",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 780
  }
 ],
 "id": "AnimatedImageResource_5E899C9C_6184_7299_41CD_2932F3DB2D34",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BBCB784_608C_FF69_41D4_CF851861DDB1_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 780
  }
 ],
 "id": "AnimatedImageResource_5F4AF1AC_618C_32B9_41D1_09B874BC3B43",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 780
  }
 ],
 "id": "AnimatedImageResource_5A3D90BD_6185_F29B_41D3_C5E760D54ED0",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BC6FE64_608C_F1A9_41CA_C2DA2F7D700F_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 780
  }
 ],
 "id": "AnimatedImageResource_5F4B21AC_618C_32B9_41BC_F38051E2A683",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0_HS_0_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 780
  }
 ],
 "id": "AnimatedImageResource_476272D0_60BF_D6E9_41AC_69C7274112C1",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BBDEA9E_608C_5696_41C6_5B8A4E5F1484_0_HS_1_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 1050
  }
 ],
 "id": "AnimatedImageResource_444AC909_60BC_737B_41B3_951F4CF380CD",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0_HS_2_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 780
  }
 ],
 "id": "AnimatedImageResource_55D38F06_6084_CF69_41AC_9051F223E6E2",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0_HS_3_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 1050
  }
 ],
 "id": "AnimatedImageResource_51579D36_6085_D3A9_41BC_33EEA669F83F",
 "rowCount": 6,
 "frameCount": 24
},
{
 "colCount": 4,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_6BBD9128_608C_53B9_4198_42AA5ACBB6A6_0_HS_4_0.png",
   "width": 1200,
   "class": "ImageResourceLevel",
   "height": 1050
  }
 ],
 "id": "AnimatedImageResource_51571D36_6085_D3A9_41CC_5ED1596264AD",
 "rowCount": 6,
 "frameCount": 24
},
{
 "horizontalAlign": "center",
 "maxHeight": 60,
 "maxWidth": 60,
 "id": "IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329",
 "width": 60,
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "height": 60,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "toggle",
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "propagateClick": true,
 "iconURL": "skin/IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329.png",
 "paddingBottom": 0,
 "click": "if(!this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE.get('visible')){ this.setComponentVisibility(this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE, true, 0, null, null, false) } else { this.setComponentVisibility(this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE, false, 0, null, null, false) }",
 "class": "IconButton",
 "borderSize": 0,
 "transparencyActive": true,
 "data": {
  "name": "image button menu"
 },
 "shadow": false,
 "pressedIconURL": "skin/IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329_pressed.png",
 "cursor": "hand"
},
{
 "horizontalAlign": "center",
 "maxHeight": 58,
 "maxWidth": 58,
 "id": "IconButton_EE5807F6_E3BE_860E_41E7_431DDDA54BAC",
 "width": 58,
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "height": 58,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_EE5807F6_E3BE_860E_41E7_431DDDA54BAC_rollover.png",
 "propagateClick": true,
 "iconURL": "skin/IconButton_EE5807F6_E3BE_860E_41E7_431DDDA54BAC.png",
 "paddingBottom": 0,
 "click": "this.shareTwitter(window.location.href)",
 "class": "IconButton",
 "borderSize": 0,
 "transparencyActive": true,
 "data": {
  "name": "IconButton TWITTER"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "horizontalAlign": "center",
 "maxHeight": 58,
 "maxWidth": 58,
 "id": "IconButton_EED5213F_E3B9_7A7D_41D8_1B642C004521",
 "width": 58,
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "height": 58,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_EED5213F_E3B9_7A7D_41D8_1B642C004521_rollover.png",
 "propagateClick": true,
 "iconURL": "skin/IconButton_EED5213F_E3B9_7A7D_41D8_1B642C004521.png",
 "paddingBottom": 0,
 "click": "this.shareFacebook(window.location.href)",
 "class": "IconButton",
 "borderSize": 0,
 "transparencyActive": true,
 "data": {
  "name": "IconButton FB"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "horizontalAlign": "left",
 "id": "Container_21F34780_3014_BF93_41A2_9BF700588BEC",
 "left": "0%",
 "scrollBarMargin": 2,
 "width": 36,
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "top": "0%",
 "backgroundOpacity": 0.4,
 "minWidth": 1,
 "backgroundColor": [
  "#000000"
 ],
 "paddingLeft": 0,
 "borderRadius": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "height": "100%",
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container black"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "center",
 "maxHeight": 80,
 "maxWidth": 80,
 "id": "IconButton_223F0171_3014_B375_41C1_61063C3D73B3",
 "left": 10,
 "width": 50,
 "minHeight": 1,
 "verticalAlign": "middle",
 "top": "40%",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "bottom": "40%",
 "paddingLeft": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_223F0171_3014_B375_41C1_61063C3D73B3_rollover.png",
 "propagateClick": true,
 "iconURL": "skin/IconButton_223F0171_3014_B375_41C1_61063C3D73B3.png",
 "paddingBottom": 0,
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, false, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, false, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, true, 0, null, null, false)",
 "class": "IconButton",
 "borderSize": 0,
 "transparencyActive": true,
 "data": {
  "name": "IconButton arrow"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_0B85764A_2D07_4D95_41A5_3AC872515A8C"
 ],
 "id": "Container_4521E58D_74A8_853A_418A_CF7FF914DD83",
 "left": "0%",
 "scrollBarMargin": 2,
 "width": "90%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "top": "0%",
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingLeft": 0,
 "borderRadius": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "center",
 "maxHeight": 50,
 "maxWidth": 50,
 "id": "IconButton_1AF35943_2D07_479B_41AF_FBC8A1477882",
 "width": 50,
 "right": 9,
 "minHeight": 1,
 "verticalAlign": "middle",
 "top": "40%",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "bottom": "40%",
 "paddingLeft": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_1AF35943_2D07_479B_41AF_FBC8A1477882_rollover.png",
 "propagateClick": true,
 "iconURL": "skin/IconButton_1AF35943_2D07_479B_41AF_FBC8A1477882.png",
 "paddingBottom": 0,
 "click": "this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false)",
 "class": "IconButton",
 "borderSize": 0,
 "transparencyActive": true,
 "data": {
  "name": "IconButton collapse"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "horizontalAlign": "center",
 "children": [
  "this.Image_062A182F_1140_E20B_41B0_9CB8FFD6AA5A"
 ],
 "id": "Container_062A682F_1140_E20B_41B0_3071FCBF3DC9",
 "scrollBarMargin": 2,
 "width": "85%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundColor": [
  "#000000"
 ],
 "backgroundOpacity": 1,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "-left"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_062A3830_1140_E215_4195_1698933FE51C",
  "this.Container_062A2830_1140_E215_41AA_EB25B7BD381C",
  "this.Container_062AE830_1140_E215_4180_196ED689F4BD"
 ],
 "id": "Container_062A082F_1140_E20A_4193_DF1A4391DC79",
 "scrollBarMargin": 2,
 "width": "50%",
 "contentOpaque": false,
 "layout": "vertical",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 50,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 1,
 "minWidth": 460,
 "borderRadius": 0,
 "paddingLeft": 50,
 "gap": 0,
 "paddingTop": 20,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 20,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#0069A3",
 "data": {
  "name": "-right"
 },
 "shadow": false,
 "scrollBarOpacity": 0.51,
 "overflow": "visible",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "center",
 "maxHeight": 60,
 "maxWidth": 60,
 "id": "IconButton_062A8830_1140_E215_419D_3439F16CCB3E",
 "width": "25%",
 "minHeight": 50,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_062A8830_1140_E215_419D_3439F16CCB3E_rollover.jpg",
 "propagateClick": false,
 "iconURL": "skin/IconButton_062A8830_1140_E215_419D_3439F16CCB3E.jpg",
 "paddingBottom": 0,
 "click": "this.setComponentVisibility(this.Container_062AB830_1140_E215_41AF_6C9D65345420, false, 0, null, null, false)",
 "class": "IconButton",
 "borderSize": 0,
 "transparencyActive": false,
 "height": "75%",
 "data": {
  "name": "X"
 },
 "shadow": false,
 "pressedIconURL": "skin/IconButton_062A8830_1140_E215_419D_3439F16CCB3E_pressed.jpg",
 "cursor": "hand"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.IconButton_38922473_0C06_2593_4199_C585853A1AB3"
 ],
 "id": "Container_3A67552A_0C3A_67BD_4195_ECE46CCB34EA",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 140,
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "header"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "itemMaxHeight": 1000,
 "horizontalAlign": "center",
 "id": "ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0",
 "left": 0,
 "itemLabelFontFamily": "Oswald",
 "rollOverItemThumbnailShadowColor": "#04A3E1",
 "width": "100%",
 "rollOverItemThumbnailShadowVerticalLength": 0,
 "itemBorderRadius": 0,
 "itemHorizontalAlign": "center",
 "selectedItemThumbnailShadowBlurRadius": 16,
 "minHeight": 1,
 "itemLabelPosition": "bottom",
 "verticalAlign": "middle",
 "paddingRight": 70,
 "backgroundOpacity": 0,
 "itemPaddingLeft": 3,
 "height": "92%",
 "playList": "this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist",
 "itemThumbnailBorderRadius": 0,
 "minWidth": 1,
 "paddingLeft": 70,
 "rollOverItemThumbnailShadowBlurRadius": 0,
 "borderSize": 0,
 "itemBackgroundOpacity": 0,
 "itemBackgroundColor": [],
 "class": "ThumbnailGrid",
 "itemWidth": 220,
 "propagateClick": true,
 "itemMinHeight": 50,
 "itemBackgroundColorRatios": [],
 "itemPaddingTop": 3,
 "shadow": false,
 "itemThumbnailOpacity": 1,
 "itemVerticalAlign": "top",
 "selectedItemThumbnailShadow": true,
 "rollOverItemLabelFontColor": "#04A3E1",
 "scrollBarMargin": 2,
 "itemThumbnailHeight": 125,
 "itemLabelTextDecoration": "none",
 "itemMinWidth": 50,
 "itemLabelFontWeight": "normal",
 "rollOverItemThumbnailShadow": true,
 "itemPaddingRight": 3,
 "itemThumbnailScaleMode": "fit_outside",
 "itemLabelFontSize": 16,
 "itemHeight": 160,
 "selectedItemLabelFontColor": "#04A3E1",
 "scrollBarWidth": 10,
 "itemThumbnailWidth": 220,
 "itemOpacity": 1,
 "bottom": -0.2,
 "borderRadius": 5,
 "itemLabelFontColor": "#666666",
 "itemBackgroundColorDirection": "vertical",
 "gap": 26,
 "paddingTop": 10,
 "itemThumbnailShadow": false,
 "paddingBottom": 70,
 "selectedItemLabelFontWeight": "bold",
 "scrollBarColor": "#04A3E1",
 "itemPaddingBottom": 3,
 "selectedItemThumbnailShadowHorizontalLength": 0,
 "itemLabelGap": 7,
 "itemLabelFontStyle": "italic",
 "rollOverItemThumbnailShadowHorizontalLength": 8,
 "scrollBarOpacity": 0.5,
 "itemLabelHorizontalAlign": "center",
 "selectedItemThumbnailShadowVerticalLength": 0,
 "data": {
  "name": "ThumbnailList"
 },
 "scrollBarVisible": "rollOver",
 "itemMode": "normal",
 "itemMaxWidth": 1000
},
{
 "id": "WebFrame_22F9EEFF_0C1A_2293_4165_411D4444EFEA",
 "insetBorder": false,
 "width": "100%",
 "scrollEnabled": true,
 "url": "https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d837.8878811059448!2d-46.59894165786781!3d-23.82978441273981!3m2!1i1024!2i768!4f13.1!5e1!3m2!1spt-BR!2sbr!4v1629413592618!5m2!1spt-BR!2sbr",
 "minHeight": 1,
 "paddingRight": 0,
 "backgroundColor": [
  "#FFFFFF"
 ],
 "backgroundOpacity": 1,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "propagateClick": true,
 "height": "100%",
 "paddingBottom": 0,
 "class": "WebFrame",
 "borderSize": 0,
 "backgroundColorRatios": [
  0
 ],
 "data": {
  "name": "WebFrame"
 },
 "shadow": false,
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "center",
 "maxHeight": 60,
 "maxWidth": 60,
 "id": "IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF",
 "width": "25%",
 "minHeight": 50,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF_rollover.jpg",
 "propagateClick": true,
 "iconURL": "skin/IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF.jpg",
 "paddingBottom": 0,
 "click": "this.setComponentVisibility(this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7, false, 0, null, null, false)",
 "class": "IconButton",
 "borderSize": 0,
 "transparencyActive": false,
 "height": "75%",
 "data": {
  "name": "X"
 },
 "shadow": false,
 "pressedIconURL": "skin/IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF_pressed.jpg",
 "cursor": "hand"
},
{
 "playbackBarHeight": 10,
 "toolTipFontSize": "13px",
 "id": "MapViewer",
 "left": 0,
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadowVerticalLength": 0,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "toolTipTextShadowColor": "#000000",
 "toolTipTextShadowBlurRadius": 3,
 "width": "100%",
 "toolTipFontWeight": "normal",
 "playbackBarRight": 0,
 "toolTipPaddingBottom": 7,
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#00FF00",
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "playbackBarProgressBorderSize": 0,
 "minHeight": 1,
 "playbackBarBorderRadius": 0,
 "transitionDuration": 500,
 "paddingRight": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderRadius": 0,
 "height": "99.975%",
 "toolTipFontStyle": "normal",
 "minWidth": 1,
 "paddingLeft": 0,
 "progressLeft": 0,
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipShadowOpacity": 0,
 "borderSize": 0,
 "propagateClick": true,
 "toolTipTextShadowOpacity": 0,
 "vrPointerSelectionColor": "#FF6600",
 "class": "ViewerArea",
 "playbackBarBorderSize": 0,
 "toolTipFontFamily": "Georgia",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "playbackBarBackgroundOpacity": 1,
 "shadow": false,
 "progressRight": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "vrPointerSelectionTime": 2000,
 "progressBarBackgroundColorDirection": "vertical",
 "progressBottom": 2,
 "toolTipBackgroundColor": "#000000",
 "toolTipFontColor": "#FFFFFF",
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "playbackBarHeadShadowOpacity": 0.7,
 "vrPointerColor": "#FFFFFF",
 "transitionMode": "blending",
 "progressBarOpacity": 1,
 "playbackBarBorderColor": "#FFFFFF",
 "toolTipBorderSize": 1,
 "toolTipPaddingRight": 10,
 "progressBorderSize": 0,
 "toolTipPaddingLeft": 10,
 "toolTipPaddingTop": 7,
 "toolTipDisplayTime": 600,
 "progressBorderRadius": 0,
 "top": 0,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarLeft": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBorderColor": "#0066FF",
 "paddingBottom": 0,
 "paddingTop": 0,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadOpacity": 1,
 "playbackBarBottom": 0,
 "progressBackgroundColorDirection": "vertical",
 "toolTipShadowSpread": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipBorderColor": "#767676",
 "progressBorderColor": "#FFFFFF",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "data": {
  "name": "Floor Plan"
 },
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipShadowBlurRadius": 3,
 "toolTipOpacity": 0.5
},
{
 "horizontalAlign": "left",
 "children": [
  "this.IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E"
 ],
 "id": "Container_2F8A7686_0D4F_6B71_41A9_1A894413085C",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 140,
 "paddingBottom": 0,
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "class": "Container",
 "data": {
  "name": "header"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.ViewerAreaLabeled_2A198C4C_0D3B_DFF0_419F_C9A785406D9C",
  "this.IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482",
  "this.IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510",
  "this.IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1"
 ],
 "id": "Container_2A19EC4C_0D3B_DFF0_414D_37145C22C5BC",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "height": "100%",
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container photo"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "visible",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "center",
 "children": [
  "this.Image_1E19C23C_57F1_802D_41D1_9DC72DB5C1E1"
 ],
 "id": "Container_1E19E23C_57F1_802D_41D1_9B8B4D1D2BBD",
 "scrollBarMargin": 2,
 "width": "55%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundColor": [
  "#000000"
 ],
 "backgroundOpacity": 1,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "-left"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_1E18223C_57F1_802D_41D5_C1ECF1EB519F",
  "this.Container_1E18323C_57F1_802D_41AC_3EB4DE555BBC",
  "this.Container_1E18523C_57F1_802D_41B1_88C86CD9A273"
 ],
 "id": "Container_1E19D23C_57F1_802D_41B0_92437DF80B82",
 "scrollBarMargin": 2,
 "width": "45%",
 "contentOpaque": false,
 "layout": "vertical",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 60,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 1,
 "minWidth": 460,
 "borderRadius": 0,
 "paddingLeft": 60,
 "gap": 0,
 "paddingTop": 20,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 20,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#0069A3",
 "data": {
  "name": "-right"
 },
 "shadow": false,
 "scrollBarOpacity": 0.51,
 "overflow": "visible",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "center",
 "maxHeight": 60,
 "maxWidth": 60,
 "id": "IconButton_1E18B23C_57F1_802D_41C8_61C0F9BCC1FF",
 "width": "25%",
 "minHeight": 50,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_1E18B23C_57F1_802D_41C8_61C0F9BCC1FF_rollover.jpg",
 "propagateClick": false,
 "iconURL": "skin/IconButton_1E18B23C_57F1_802D_41C8_61C0F9BCC1FF.jpg",
 "paddingBottom": 0,
 "click": "this.setComponentVisibility(this.Container_1E18823C_57F1_802D_41C1_C325A6BB2CA9, false, 0, null, null, false)",
 "class": "IconButton",
 "borderSize": 0,
 "transparencyActive": false,
 "height": "75%",
 "data": {
  "name": "X"
 },
 "shadow": false,
 "pressedIconURL": "skin/IconButton_1E18B23C_57F1_802D_41C8_61C0F9BCC1FF_pressed.jpg",
 "cursor": "hand"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Image_0435F73B_2D0F_4BF4_4181_65F86A8DAC19",
  "this.Container_0A898462_2D0B_4D94_41B3_BDB53B7688EE",
  "this.Container_19256A12_2D07_45B5_41AB_E9DE96B2DFF3",
  "this.Container_2A2CB53C_310E_0014_41C3_AB834B10253B",
  "this.Container_159EADDD_31FA_0014_41C8_8A5203EC627B",
  "this.Container_17569D7D_31FA_0015_41C4_CBC688763A8D",
  "this.Container_1758A215_31FA_0014_41B6_9A4A5384548B",
  "this.Container_17EBA2B7_3106_0014_41A9_D6C96D0633AE",
  "this.Container_168D8311_3106_01EC_41B0_F2D40886AB88",
  "this.Label_46A65C87_6084_5177_41B3_723CA5F009E1"
 ],
 "id": "Container_0B85764A_2D07_4D95_41A5_3AC872515A8C",
 "left": "0%",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 40,
 "top": "0%",
 "backgroundOpacity": 0.31,
 "minWidth": 1,
 "backgroundColor": [
  "#009900"
 ],
 "paddingLeft": 40,
 "borderRadius": 0,
 "gap": 10,
 "paddingTop": 40,
 "propagateClick": true,
 "height": "100%",
 "paddingBottom": 40,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "- Buttons set"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "center",
 "maxHeight": 1000,
 "maxWidth": 2000,
 "id": "Image_062A182F_1140_E20B_41B0_9CB8FFD6AA5A",
 "left": "0%",
 "width": "100%",
 "url": "skin/Image_062A182F_1140_E20B_41B0_9CB8FFD6AA5A.jpg",
 "minHeight": 1,
 "top": "0%",
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 0,
 "class": "Image",
 "borderSize": 0,
 "scaleMode": "fit_outside",
 "data": {
  "name": "Image"
 },
 "shadow": false
},
{
 "horizontalAlign": "right",
 "id": "Container_062A3830_1140_E215_4195_1698933FE51C",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "horizontal",
 "minHeight": 0,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 60,
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 0,
 "paddingTop": 20,
 "propagateClick": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container space"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.HTMLText_062AD830_1140_E215_41B0_321699661E7F",
  "this.Button_062AF830_1140_E215_418D_D2FC11B12C47"
 ],
 "id": "Container_062A2830_1140_E215_41AA_EB25B7BD381C",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "vertical",
 "minHeight": 520,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 0.3,
 "minWidth": 100,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 30,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#E73B2C",
 "data": {
  "name": "Container text"
 },
 "shadow": false,
 "scrollBarOpacity": 0.79,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "id": "Container_062AE830_1140_E215_4180_196ED689F4BD",
 "scrollBarMargin": 2,
 "width": 370,
 "contentOpaque": false,
 "layout": "horizontal",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "height": 40,
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container space"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "right",
 "maxHeight": 60,
 "maxWidth": 60,
 "id": "IconButton_38922473_0C06_2593_4199_C585853A1AB3",
 "width": "100%",
 "right": 20,
 "minHeight": 50,
 "top": 20,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3_rollover.jpg",
 "propagateClick": true,
 "iconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3.jpg",
 "paddingBottom": 0,
 "click": "this.setComponentVisibility(this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15, false, 0, null, null, false)",
 "class": "IconButton",
 "borderSize": 0,
 "transparencyActive": false,
 "height": "36.14%",
 "data": {
  "name": "IconButton X"
 },
 "shadow": false,
 "pressedIconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3_pressed.jpg",
 "cursor": "hand"
},
{
 "horizontalAlign": "right",
 "maxHeight": 60,
 "maxWidth": 60,
 "id": "IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E",
 "width": "100%",
 "right": 20,
 "minHeight": 50,
 "top": 20,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E_rollover.jpg",
 "propagateClick": true,
 "iconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E.jpg",
 "paddingBottom": 0,
 "click": "this.setComponentVisibility(this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41, false, 0, null, null, false)",
 "class": "IconButton",
 "borderSize": 0,
 "transparencyActive": false,
 "height": "36.14%",
 "data": {
  "name": "IconButton X"
 },
 "shadow": false,
 "pressedIconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E_pressed.jpg",
 "cursor": "hand"
},
{
 "playbackBarHeight": 10,
 "toolTipFontSize": "13px",
 "id": "ViewerAreaLabeled_2A198C4C_0D3B_DFF0_419F_C9A785406D9C",
 "left": "0%",
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadowVerticalLength": 0,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "toolTipTextShadowColor": "#000000",
 "toolTipTextShadowBlurRadius": 3,
 "width": "100%",
 "toolTipFontWeight": "normal",
 "playbackBarRight": 0,
 "toolTipPaddingBottom": 7,
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#00FF00",
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "playbackBarProgressBorderSize": 0,
 "minHeight": 1,
 "playbackBarBorderRadius": 0,
 "transitionDuration": 500,
 "paddingRight": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderRadius": 0,
 "height": "100%",
 "toolTipFontStyle": "normal",
 "minWidth": 1,
 "paddingLeft": 0,
 "progressLeft": 0,
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipShadowOpacity": 0,
 "borderSize": 0,
 "propagateClick": true,
 "toolTipTextShadowOpacity": 0,
 "vrPointerSelectionColor": "#FF6600",
 "class": "ViewerArea",
 "playbackBarBorderSize": 0,
 "toolTipFontFamily": "Georgia",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "playbackBarBackgroundOpacity": 1,
 "shadow": false,
 "progressRight": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "vrPointerSelectionTime": 2000,
 "progressBarBackgroundColorDirection": "vertical",
 "progressBottom": 2,
 "toolTipBackgroundColor": "#000000",
 "toolTipFontColor": "#FFFFFF",
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "playbackBarHeadShadowOpacity": 0.7,
 "vrPointerColor": "#FFFFFF",
 "transitionMode": "blending",
 "progressBarOpacity": 1,
 "playbackBarBorderColor": "#FFFFFF",
 "toolTipBorderSize": 1,
 "toolTipPaddingRight": 10,
 "progressBorderSize": 0,
 "toolTipPaddingLeft": 10,
 "toolTipPaddingTop": 7,
 "toolTipDisplayTime": 600,
 "progressBorderRadius": 0,
 "top": "0%",
 "progressBackgroundColorRatios": [
  0.01
 ],
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarLeft": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBorderColor": "#0066FF",
 "paddingBottom": 0,
 "paddingTop": 0,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadOpacity": 1,
 "playbackBarBottom": 0,
 "progressBackgroundColorDirection": "vertical",
 "toolTipShadowSpread": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipBorderColor": "#767676",
 "progressBorderColor": "#FFFFFF",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "data": {
  "name": "Viewer photoalbum 1"
 },
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipShadowBlurRadius": 3,
 "toolTipOpacity": 0.5
},
{
 "horizontalAlign": "center",
 "maxHeight": 60,
 "maxWidth": 60,
 "id": "IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482",
 "left": 10,
 "width": "14.22%",
 "minHeight": 50,
 "top": "20%",
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "bottom": "20%",
 "paddingLeft": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482_rollover.png",
 "propagateClick": true,
 "iconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482.png",
 "paddingBottom": 0,
 "class": "IconButton",
 "borderSize": 0,
 "transparencyActive": false,
 "data": {
  "name": "IconButton <"
 },
 "shadow": false,
 "pressedIconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482_pressed.png",
 "cursor": "hand"
},
{
 "horizontalAlign": "center",
 "maxHeight": 60,
 "maxWidth": 60,
 "id": "IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510",
 "width": "14.22%",
 "right": 10,
 "minHeight": 50,
 "top": "20%",
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "bottom": "20%",
 "paddingLeft": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510_rollover.png",
 "propagateClick": true,
 "iconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510.png",
 "paddingBottom": 0,
 "class": "IconButton",
 "borderSize": 0,
 "transparencyActive": false,
 "data": {
  "name": "IconButton >"
 },
 "shadow": false,
 "pressedIconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510_pressed.png",
 "cursor": "hand"
},
{
 "horizontalAlign": "right",
 "maxHeight": 60,
 "maxWidth": 60,
 "id": "IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1",
 "width": "10%",
 "right": 20,
 "minHeight": 50,
 "top": 20,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 50,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1_rollover.jpg",
 "propagateClick": true,
 "iconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1.jpg",
 "paddingBottom": 0,
 "click": "this.setComponentVisibility(this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E, false, 0, null, null, false)",
 "class": "IconButton",
 "borderSize": 0,
 "transparencyActive": false,
 "height": "10%",
 "data": {
  "name": "IconButton X"
 },
 "shadow": false,
 "pressedIconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1_pressed.jpg",
 "cursor": "hand"
},
{
 "horizontalAlign": "center",
 "maxHeight": 1000,
 "maxWidth": 2000,
 "id": "Image_1E19C23C_57F1_802D_41D1_9DC72DB5C1E1",
 "left": "0%",
 "width": "100%",
 "url": "skin/Image_1E19C23C_57F1_802D_41D1_9DC72DB5C1E1.jpg",
 "minHeight": 1,
 "top": "0%",
 "verticalAlign": "bottom",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 0,
 "class": "Image",
 "borderSize": 0,
 "scaleMode": "fit_outside",
 "data": {
  "name": "Image40635"
 },
 "shadow": false
},
{
 "horizontalAlign": "right",
 "id": "Container_1E18223C_57F1_802D_41D5_C1ECF1EB519F",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "horizontal",
 "minHeight": 0,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 0,
 "paddingTop": 20,
 "propagateClick": false,
 "height": "5%",
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container space"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.HTMLText_1E18123C_57F1_802D_41D2_B0CD0D6533F4",
  "this.Container_1E18623C_57F1_802D_41D5_C4D10C61A206"
 ],
 "id": "Container_1E18323C_57F1_802D_41AC_3EB4DE555BBC",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "vertical",
 "minHeight": 520,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 0.3,
 "minWidth": 100,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 30,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#E73B2C",
 "data": {
  "name": "Container text"
 },
 "shadow": false,
 "scrollBarOpacity": 0.79,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "id": "Container_1E18523C_57F1_802D_41B1_88C86CD9A273",
 "scrollBarMargin": 2,
 "width": 370,
 "contentOpaque": false,
 "layout": "horizontal",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "height": 40,
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container space"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "maxHeight": 1095,
 "maxWidth": 1095,
 "id": "Image_0435F73B_2D0F_4BF4_4181_65F86A8DAC19",
 "left": "0%",
 "width": "100%",
 "url": "skin/Image_0435F73B_2D0F_4BF4_4181_65F86A8DAC19.jpg",
 "minHeight": 30,
 "top": "0%",
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 40,
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "propagateClick": true,
 "height": "25%",
 "paddingBottom": 0,
 "class": "Image",
 "borderSize": 0,
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image Company"
 },
 "shadow": false
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_208C289A_3033_51B4_41BC_C3F8D8B8F86D",
  "this.Button_0AEB5577_2D08_CE7B_41B6_192923248F4E",
  "this.Container_106C4A62_2D09_C594_41C0_0D00619DF541",
  "this.Button_0A054365_2D09_CB9F_4145_8C365B373D19",
  "this.Container_152401E8_2D0B_4694_41C5_9141C985F9C3",
  "this.Button_0B73474A_2D18_CB95_41B5_180037BA80BC",
  "this.Container_1BA343A6_2D0B_4A9D_41A8_3A02573B3B89",
  "this.Button_1D2C4FDF_2D7F_BAAB_4198_FBD1E9E469FF",
  "this.Container_15283BED_2D08_DA6F_41C5_5635F0C6DB03",
  "this.Button_0399826A_2D79_4594_41BA_934A50D0E6B4",
  "this.Container_146FF082_2D09_C695_41C4_13DE74CDAF5E",
  "this.Button_1D0C50DE_2D07_C6AD_41C1_CF4547A6CFAB",
  "this.Container_207ECEAD_3035_51EC_41A3_EE49910C654D",
  "this.Label_79E877B7_60BD_DE97_41C9_5A2E3C3C00AA"
 ],
 "id": "Container_0A898462_2D0B_4D94_41B3_BDB53B7688EE",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "right": "0%",
 "layout": "vertical",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "top": "26%",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "bottom": "26%",
 "paddingLeft": 0,
 "gap": 0,
 "paddingTop": 0,
 "propagateClick": true,
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "-Level 1"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_193B8A52_2D1B_C5B5_41C3_F44FF520A3F0",
  "this.HTMLText_29DD1615_3597_79DF_41C4_7593739E5260",
  "this.Container_2B9EE463_3593_BA7B_4195_8E8F4568BB13",
  "this.Container_283049D5_35F3_AA5F_419D_20B6A59ABCA6"
 ],
 "id": "Container_19256A12_2D07_45B5_41AB_E9DE96B2DFF3",
 "left": "0%",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "vertical",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "bottom",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "bottom": "0%",
 "paddingLeft": 0,
 "gap": 5,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 130,
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "-Container footer"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Button_2A2DA53B_310E_001C_41C7_8885E712C50B",
  "this.Container_2A2DB53B_310E_001C_41BA_0206228E495C",
  "this.Container_1303E3BB_3106_001D_41C8_60D6F4D70B2F",
  "this.Button_2A2D853B_310E_001C_41C4_1C2E2BAFC35D",
  "this.Button_2A2DE53B_310E_001C_41BB_C7AB6950A4DD",
  "this.Button_2A2C253B_310E_001C_41B6_D3A7F4F68C3E",
  "this.Button_2A2C053B_310E_001C_41A2_583DE489828C",
  "this.Button_2A2C753B_310E_001C_41C4_B649CCC20E3D",
  "this.Button_2A2C553C_310E_0014_41C4_86393D0ADCC7",
  "this.Button_15EF2665_3106_0035_41AE_9BACA1A48D02",
  "this.Button_15F5A318_3106_001C_41C5_9AA2EF2184CF",
  "this.Button_1203FDB8_3106_001C_41B6_C9BE8EDD0DA9",
  "this.Button_13D4FC1E_310A_0017_41BA_DDA6D071C1BA"
 ],
 "id": "Container_2A2CB53C_310E_0014_41C3_AB834B10253B",
 "left": "0%",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "vertical",
 "creationPolicy": "inAdvance",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "top": "25%",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "bottom": "25%",
 "paddingLeft": 0,
 "gap": 0,
 "paddingTop": 0,
 "propagateClick": true,
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "-Level 2-1"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "visible": false,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Button_15A15DDC_31FA_0014_41A4_CE4305FEC7D1",
  "this.Container_15A14DDC_31FA_0014_41BE_C93192DD207E",
  "this.Container_15A16DDC_31FA_0014_4199_0FBF7553300D",
  "this.Button_15A10DDC_31FA_0014_4185_021C898E177D",
  "this.Button_15A13DDC_31FA_0014_41C5_41AE80876834",
  "this.Button_15A12DDC_31FA_0014_416B_ED845741AE5F",
  "this.Button_159EDDDC_31FA_0014_419A_61C18E43FE01",
  "this.Button_159ECDDC_31FA_0014_41B9_2D5AB1021813",
  "this.Button_159EFDDC_31FA_0014_41C6_9CF7032F84E0",
  "this.Button_159EEDDC_31FA_0014_41B6_22A86B2D2FEB",
  "this.Button_159E9DDC_31FA_0015_41B6_CB1D433C7673",
  "this.Button_159E8DDD_31FA_0014_41C5_F18F441AF371",
  "this.Button_159EBDDD_31FA_0014_41C8_935504B30727"
 ],
 "id": "Container_159EADDD_31FA_0014_41C8_8A5203EC627B",
 "left": "0%",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "vertical",
 "creationPolicy": "inAdvance",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "top": "25%",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "bottom": "25%",
 "paddingLeft": 0,
 "gap": 0,
 "paddingTop": 0,
 "propagateClick": true,
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "-Level 2-2"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "visible": false,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Button_1757CD7D_31FA_0015_4143_A9E37B16A50B",
  "this.Container_17579D7D_31FA_0015_41A1_D2B94269F28D",
  "this.Container_17578D7D_31FA_0015_41BE_353D3005648A",
  "this.Button_1757AD7D_31FA_0015_41C7_FB79F56FA149",
  "this.Button_17565D7D_31FA_0015_4193_78BBCB2DC70F",
  "this.Button_17564D7D_31FA_0015_41B8_A9191CD56C52",
  "this.Button_17567D7D_31FA_0015_41C2_1E0D0AF05C7A",
  "this.Button_17566D7D_31FA_0015_41AD_98D7C60C694F",
  "this.Button_17561D7D_31FA_0015_41B5_BD72FAC26B8B",
  "this.Button_17560D7D_31FA_0015_41C4_7F0EC7540CC2",
  "this.Button_17562D7D_31FA_0015_41A3_96B282B30DBA",
  "this.Button_1756DD7D_31FA_0015_41A5_988B67FCF8B7",
  "this.Button_1756FD7D_31FA_0015_41C7_DA2AAC2AAAEC"
 ],
 "id": "Container_17569D7D_31FA_0015_41C4_CBC688763A8D",
 "left": "0%",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "vertical",
 "creationPolicy": "inAdvance",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "top": "25%",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "bottom": "25%",
 "paddingLeft": 0,
 "gap": 0,
 "paddingTop": 0,
 "propagateClick": true,
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "-Level 2-3"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "visible": false,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Button_175A5214_31FA_0014_4198_930DF49BADD9",
  "this.Container_175A4215_31FA_0014_41B2_5B8676CC3F2F",
  "this.Container_1759B215_31FA_0014_41C0_84C99CBD5517",
  "this.Button_1759A215_31FA_0014_41C7_F6B1044E5BB3",
  "this.Button_17598215_31FA_0014_41AC_1166AB319171",
  "this.Button_1759F215_31FA_0014_41BD_BBFA5FB0D882",
  "this.Button_1759D215_31FA_0014_41AD_B6C5744A0B97",
  "this.Button_17593215_31FA_0014_41C0_42BAFB0080F0",
  "this.Button_17592215_31FA_0014_41B2_AA3B5CC318B8",
  "this.Button_17590215_31FA_0014_41C1_2B2D012DCC76",
  "this.Button_17597215_31FA_0014_41C0_9BEE1DE4D7F6",
  "this.Button_17596215_31FA_0014_41C6_A42670770708",
  "this.Button_1758B215_31FA_0014_41BC_C4EAC2A9544B"
 ],
 "id": "Container_1758A215_31FA_0014_41B6_9A4A5384548B",
 "left": "0%",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "vertical",
 "creationPolicy": "inAdvance",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "top": "25%",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "bottom": "25%",
 "paddingLeft": 0,
 "gap": 0,
 "paddingTop": 0,
 "propagateClick": true,
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "-Level 2-4"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "visible": false,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Button_17EA82B7_3106_0014_41C2_C9B0D9E6F22C",
  "this.Container_17EA92B7_3106_0014_41A6_2B88DF32BBA7",
  "this.Container_17EAA2B7_3106_0014_41B0_ACBB1485A79E",
  "this.Button_17EAB2B7_3106_0014_41A7_209417AD3E9A",
  "this.Button_17EAD2B7_3106_0014_41C0_0B5453B4841D",
  "this.Button_17EAE2B7_3106_0014_41C7_DB7FC43AAEE0",
  "this.Button_17EB02B7_3106_0014_41AF_05D9AC36B189",
  "this.Button_17EB32B7_3106_0014_41C8_467BF6AECBE8",
  "this.Button_17EB42B7_3106_0014_41B0_CE70CBDDF438",
  "this.Button_17EB52B7_3106_0014_419C_439E593AEC43",
  "this.Button_17EB62B7_3106_0014_41C5_43B38271B353",
  "this.Button_17EB72B7_3106_0014_41B9_61857077BF4A",
  "this.Button_17EB92B7_3106_0014_41B2_34A3E3F63779"
 ],
 "id": "Container_17EBA2B7_3106_0014_41A9_D6C96D0633AE",
 "left": "0%",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "vertical",
 "creationPolicy": "inAdvance",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "top": "25%",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "bottom": "25%",
 "paddingLeft": 0,
 "gap": 0,
 "paddingTop": 0,
 "propagateClick": true,
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "-Level 2-5"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "visible": false,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Button_168CA310_3106_01EC_41C7_72CE0522951A",
  "this.Container_168C8310_3106_01EC_4187_B16F315A4A23",
  "this.Container_168D7310_3106_01EC_41BE_5FCBD9E27BE4",
  "this.Button_168D6310_3106_01EC_41B8_A0B6BE627547",
  "this.Button_168D5310_3106_01EC_41B5_96D9387401B8",
  "this.Button_168D3310_3106_01EC_41AC_5D524E4677A5",
  "this.Button_168D2310_3106_01EC_41B8_9D7D1B2B55FA",
  "this.Button_168D0310_3106_01EC_41A1_FA8FC42E6FF3",
  "this.Button_168DE310_3106_01EC_4192_6A9F468A0ADE",
  "this.Button_168DD310_3106_01EC_4190_7815FA70349E",
  "this.Button_168DB310_3106_01EC_41B2_3511AA5E40E1",
  "this.Button_168DA310_3106_01EC_41BE_DF88732C2A28",
  "this.Button_168D9311_3106_01EC_41A8_3BD8769525D6"
 ],
 "id": "Container_168D8311_3106_01EC_41B0_F2D40886AB88",
 "left": "0%",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "vertical",
 "creationPolicy": "inAdvance",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "top": "25%",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "bottom": "25%",
 "paddingLeft": 0,
 "gap": 0,
 "paddingTop": 0,
 "propagateClick": true,
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "-Level 2-6"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "visible": false,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "center",
 "fontColor": "#000000",
 "id": "Label_46A65C87_6084_5177_41B3_723CA5F009E1",
 "left": "17.97%",
 "width": "46.083%",
 "text": "Como ver o tour virtual",
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "bottom": "20.05%",
 "paddingLeft": 0,
 "fontSize": "1.48vmin",
 "fontFamily": "Arial",
 "paddingTop": 0,
 "propagateClick": false,
 "height": "3.974%",
 "paddingBottom": 0,
 "fontStyle": "normal",
 "class": "Label",
 "borderSize": 0,
 "data": {
  "name": "Label49217"
 },
 "shadow": false,
 "fontWeight": "normal",
 "textDecoration": "none"
},
{
 "id": "HTMLText_062AD830_1140_E215_41B0_321699661E7F",
 "scrollBarMargin": 2,
 "width": "100%",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "paddingRight": 10,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 20,
 "borderSize": 0,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:8.42vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:4.92vh;font-family:'Oswald';\"><B><I>LOREM IPSUM</I></B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:4.92vh;font-family:'Oswald';\"><B><I>DOLOR SIT AMET</I></B></SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:2.4vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.98vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:2.4vh;font-family:'Oswald';\"><B>CONSECTETUR ADIPISCING ELIT. MORBI BIBENDUM PHARETRA LOREM, ACCUMSAN SAN NULLA.</B></SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:0.98vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.98vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.98vh;font-family:Arial, Helvetica, sans-serif;\">Mauris aliquet neque quis libero consequat vestibulum. Donec lacinia consequat dolor viverra sagittis. Praesent consequat porttitor risus, eu condimentum nunc. Proin et velit ac sapien luctus efficitur egestas ac augue. Nunc dictum, augue eget eleifend interdum, quam libero imperdiet lectus, vel scelerisque turpis lectus vel ligula. Duis a porta sem. Maecenas sollicitudin nunc id risus fringilla, a pharetra orci iaculis. Aliquam turpis ligula, tincidunt sit amet consequat ac, imperdiet non dolor.</SPAN></DIV><p STYLE=\"margin:0; line-height:0.98vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.98vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.98vh;font-family:Arial, Helvetica, sans-serif;\">Integer gravida dui quis euismod placerat. Maecenas quis accumsan ipsum. Aliquam gravida velit at dolor mollis, quis luctus mauris vulputate. Proin condimentum id nunc sed sollicitudin.</SPAN></DIV><p STYLE=\"margin:0; line-height:2.4vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.98vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:2.4vh;font-family:'Oswald';\"><B><I>DONEC FEUGIAT:</I></B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.98vh;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.64vh;\"> </SPAN>\u2022 Nisl nec mi sollicitudin facilisis </SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.98vh;font-family:Arial, Helvetica, sans-serif;\"> \u2022 Nam sed faucibus est.</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.98vh;font-family:Arial, Helvetica, sans-serif;\"> \u2022 Ut eget lorem sed leo.</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.98vh;font-family:Arial, Helvetica, sans-serif;\"> \u2022 Sollicitudin tempor sit amet non urna. </SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.98vh;font-family:Arial, Helvetica, sans-serif;\"> \u2022 Aliquam feugiat mauris sit amet.</SPAN></DIV><p STYLE=\"margin:0; line-height:2.4vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.98vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:2.4vh;font-family:'Oswald';\"><B><I>LOREM IPSUM:</I></B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:2.62vh;font-family:'Oswald';\"><B>$150,000</B></SPAN></SPAN></DIV></div>",
 "scrollBarColor": "#04A3E1",
 "class": "HTMLText",
 "data": {
  "name": "HTMLText"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "center",
 "fontColor": "#FFFFFF",
 "id": "Button_062AF830_1140_E215_418D_D2FC11B12C47",
 "pressedBackgroundColor": [
  "#000000"
 ],
 "pressedBackgroundOpacity": 1,
 "width": 180,
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "rollOverBackgroundOpacity": 1,
 "layout": "horizontal",
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "verticalAlign": "middle",
 "pressedBackgroundColorRatios": [
  0
 ],
 "borderColor": "#000000",
 "paddingRight": 0,
 "height": 50,
 "backgroundOpacity": 0.7,
 "minWidth": 1,
 "mode": "push",
 "backgroundColor": [
  "#04A3E1"
 ],
 "paddingLeft": 0,
 "borderRadius": 50,
 "shadowSpread": 1,
 "label": "LOREM IPSUM",
 "paddingTop": 0,
 "propagateClick": false,
 "fontSize": "2.39vh",
 "paddingBottom": 0,
 "gap": 5,
 "fontStyle": "italic",
 "class": "Button",
 "borderSize": 0,
 "backgroundColorRatios": [
  0
 ],
 "data": {
  "name": "Button"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "bold",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "id": "HTMLText_1E18123C_57F1_802D_41D2_B0CD0D6533F4",
 "scrollBarMargin": 2,
 "width": "100%",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "46%",
 "paddingBottom": 0,
 "borderSize": 0,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:8.42vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:4.92vh;font-family:'Oswald';\"><B><I>LOREM IPSUM</I></B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:4.92vh;font-family:'Oswald';\"><B><I>DOLOR SIT AMET</I></B></SPAN></SPAN></DIV></div>",
 "scrollBarColor": "#04A3E1",
 "class": "HTMLText",
 "data": {
  "name": "HTMLText18899"
 },
 "shadow": false,
 "scrollBarOpacity": 0,
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Image_1E18723C_57F1_802D_41C5_8325536874A5",
  "this.HTMLText_1E18423C_57F1_802D_41C4_458DB7F892AC"
 ],
 "id": "Container_1E18623C_57F1_802D_41D5_C4D10C61A206",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "horizontal",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "75%",
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "- content"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "id": "Container_208C289A_3033_51B4_41BC_C3F8D8B8F86D",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 1,
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "line"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_0AEB5577_2D08_CE7B_41B6_192923248F4E",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_0A898462_2D0B_4D94_41B3_BDB53B7688EE, false, 0, null, null, false); this.setComponentVisibility(this.Container_2A2CB53C_310E_0014_41C3_AB834B10253B, true, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 50,
 "paddingBottom": 0,
 "label": "RECEPTION >",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button Tour Info"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "id": "Container_106C4A62_2D09_C594_41C0_0D00619DF541",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 1,
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "line"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 23,
 "fontColor": "#FFFFFF",
 "id": "Button_0A054365_2D09_CB9F_4145_8C365B373D19",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_0A898462_2D0B_4D94_41B3_BDB53B7688EE, false, 0, null, null, false); this.setComponentVisibility(this.Container_159EADDD_31FA_0014_41C8_8A5203EC627B, true, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 50,
 "paddingBottom": 0,
 "label": "ROOMS >",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button Panorama List"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "id": "Container_152401E8_2D0B_4694_41C5_9141C985F9C3",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 1,
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "line"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_0B73474A_2D18_CB95_41B5_180037BA80BC",
 "pressedLabel": "Inserdt Text",
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "rollOverBackgroundOpacity": 0.8,
 "click": "this.setComponentVisibility(this.Container_0A898462_2D0B_4D94_41B3_BDB53B7688EE, false, 0, null, null, false); this.setComponentVisibility(this.Container_17569D7D_31FA_0015_41C4_CBC688763A8D, true, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "layout": "horizontal",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 50,
 "paddingBottom": 0,
 "label": "AMENITIES >",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button Location"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "id": "Container_1BA343A6_2D0B_4A9D_41A8_3A02573B3B89",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 1,
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "line"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_1D2C4FDF_2D7F_BAAB_4198_FBD1E9E469FF",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_0A898462_2D0B_4D94_41B3_BDB53B7688EE, false, 0, null, null, false); this.setComponentVisibility(this.Container_1758A215_31FA_0014_41B6_9A4A5384548B, true, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 50,
 "paddingBottom": 0,
 "label": "SPORTS AREA >",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button Floorplan"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "id": "Container_15283BED_2D08_DA6F_41C5_5635F0C6DB03",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 1,
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "line"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_0399826A_2D79_4594_41BA_934A50D0E6B4",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_0A898462_2D0B_4D94_41B3_BDB53B7688EE, false, 0, null, null, false); this.setComponentVisibility(this.Container_17EBA2B7_3106_0014_41A9_D6C96D0633AE, true, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 50,
 "paddingBottom": 0,
 "label": "SWIMMING POOL >",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button Photoalbum"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "id": "Container_146FF082_2D09_C695_41C4_13DE74CDAF5E",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 1,
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "line"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_1D0C50DE_2D07_C6AD_41C1_CF4547A6CFAB",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_0A898462_2D0B_4D94_41B3_BDB53B7688EE, false, 0, null, null, false); this.setComponentVisibility(this.Container_168D8311_3106_01EC_41B0_F2D40886AB88, true, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 50,
 "paddingBottom": 0,
 "label": "RESTAURANTS >",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button Contact"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "id": "Container_207ECEAD_3035_51EC_41A3_EE49910C654D",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 1,
 "backgroundOpacity": 0.3,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "line"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "center",
 "fontColor": "#FFFFFF",
 "id": "Label_79E877B7_60BD_DE97_41C9_5A2E3C3C00AA",
 "width": "100%",
 "fontFamily": "Candara",
 "text": "Teste",
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "fontSize": "5vmin",
 "paddingTop": 0,
 "propagateClick": false,
 "height": "10.23%",
 "paddingBottom": 0,
 "fontStyle": "normal",
 "borderSize": 0,
 "class": "Label",
 "data": {
  "name": "Label32739"
 },
 "shadow": false,
 "fontWeight": "bold",
 "textDecoration": "none"
},
{
 "horizontalAlign": "left",
 "id": "Container_193B8A52_2D1B_C5B5_41C3_F44FF520A3F0",
 "scrollBarMargin": 2,
 "width": 40,
 "contentOpaque": false,
 "layout": "horizontal",
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "height": 2,
 "backgroundOpacity": 1,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#5CA1DE"
 ],
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "blue line"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "visible",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "id": "HTMLText_29DD1615_3597_79DF_41C4_7593739E5260",
 "scrollBarMargin": 2,
 "width": "100%",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 78,
 "paddingBottom": 0,
 "borderSize": 0,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#ffffff;font-size:14px;font-family:'Oswald Regular';\"><I>Company Name</I></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#ffffff;font-size:14px;font-family:'Oswald Regular';\"><I>www.loremipsum.com</I></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#ffffff;font-size:14px;font-family:'Oswald Regular';\"><I>info@loremipsum.com</I></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#ffffff;font-size:14px;font-family:'Oswald Regular';\"><I>Tlf.: +11 111 111 111</I></SPAN></SPAN></DIV></div>",
 "scrollBarColor": "#000000",
 "class": "HTMLText",
 "data": {
  "name": "HTMLText47602"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "visible": false,
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.IconButton_2B90E40F_3593_B9CB_41B4_408768336038",
  "this.IconButton_2B90C410_3593_B9D5_41AB_13AB96397D83",
  "this.IconButton_2B90A410_3593_B9D5_41B7_0B5CCA80EF0F",
  "this.IconButton_2B917411_3593_B9D7_41C6_8D1102463EC5"
 ],
 "id": "Container_2B9EE463_3593_BA7B_4195_8E8F4568BB13",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "horizontal",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "bottom",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 7,
 "paddingTop": 0,
 "propagateClick": false,
 "height": 56,
 "paddingBottom": 0,
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "class": "Container",
 "data": {
  "name": "-Container Icons 1"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "visible",
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.IconButton_2BBEA1DF_35B3_BA4B_41B8_DE69AA453A15",
  "this.IconButton_2B721244_35B1_D9BD_41C8_FCB90D5BD7F7",
  "this.IconButton_2A159B11_35B0_EFD6_41C9_DF408F8120FF",
  "this.IconButton_2B371BEA_35AF_6E75_41C9_D7DBED7ABF6F"
 ],
 "id": "Container_283049D5_35F3_AA5F_419D_20B6A59ABCA6",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "horizontal",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 7,
 "paddingTop": 0,
 "propagateClick": false,
 "height": 44,
 "paddingBottom": 0,
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "class": "Container",
 "data": {
  "name": "-Container Icons 2"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "visible",
 "scrollBarVisible": "rollOver"
},
{
 "rollOverFontFamily": "Oswald",
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_2A2DA53B_310E_001C_41C7_8885E712C50B",
 "rollOverFontSize": 18,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 30,
 "rollOverBackgroundOpacity": 0.8,
 "click": "this.setComponentVisibility(this.Container_2A2CB53C_310E_0014_41C3_AB834B10253B, false, 0, null, null, false); this.setComponentVisibility(this.Container_0A898462_2D0B_4D94_41B3_BDB53B7688EE, true, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "layout": "horizontal",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 5,
 "shadowSpread": 1,
 "paddingTop": 0,
 "rollOverIconURL": "skin/Button_2A2DA53B_310E_001C_41C7_8885E712C50B_rollover.png",
 "propagateClick": true,
 "height": 50,
 "paddingBottom": 0,
 "label": "BACK",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "iconURL": "skin/Button_2A2DA53B_310E_001C_41C7_8885E712C50B.png",
 "data": {
  "name": "Button <BACK"
 },
 "shadow": false,
 "iconWidth": 30,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "id": "Container_2A2DB53B_310E_001C_41BA_0206228E495C",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 1,
 "backgroundOpacity": 0.5,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "line"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "id": "Container_1303E3BB_3106_001D_41C8_60D6F4D70B2F",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 8,
 "paddingBottom": 0,
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "class": "Container",
 "data": {
  "name": "line separator"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver"
},
{
 "rollOverShadowBlurRadius": 18,
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_2A2D853B_310E_001C_41C4_1C2E2BAFC35D",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "rollOverShadow": false,
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 15,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Main Entrance",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 1"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 23,
 "fontColor": "#FFFFFF",
 "id": "Button_2A2DE53B_310E_001C_41BB_C7AB6950A4DD",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lobby",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 2"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_2A2C253B_310E_001C_41B6_D3A7F4F68C3E",
 "pressedLabel": "Reception",
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "rollOverBackgroundOpacity": 0.8,
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "layout": "horizontal",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Reception",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 3"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_2A2C053B_310E_001C_41A2_583DE489828C",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Meeting Area 1",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 4"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_2A2C753B_310E_001C_41C4_B649CCC20E3D",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Meeting Area 2",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 5"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_2A2C553C_310E_0014_41C4_86393D0ADCC7",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Bar",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 6"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_15EF2665_3106_0035_41AE_9BACA1A48D02",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Chill Out",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 7"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_15F5A318_3106_001C_41C5_9AA2EF2184CF",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Terrace",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 8"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_1203FDB8_3106_001C_41B6_C9BE8EDD0DA9",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 0,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Garden",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 9"
 },
 "shadow": false,
 "iconWidth": 32,
 "visible": false,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_13D4FC1E_310A_0017_41BA_DDA6D071C1BA",
 "pressedBackgroundColor": [
  "#000000"
 ],
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "rollOverBackgroundOpacity": 0.8,
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "layout": "horizontal",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 0,
 "shadowSpread": 1,
 "pressedBackgroundColorRatios": [
  0
 ],
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 10"
 },
 "shadow": false,
 "iconWidth": 32,
 "visible": false,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "rollOverFontFamily": "Oswald",
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_15A15DDC_31FA_0014_41A4_CE4305FEC7D1",
 "rollOverFontSize": 18,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 30,
 "rollOverBackgroundOpacity": 0.8,
 "click": "this.setComponentVisibility(this.Container_159EADDD_31FA_0014_41C8_8A5203EC627B, false, 0, null, null, false); this.setComponentVisibility(this.Container_0A898462_2D0B_4D94_41B3_BDB53B7688EE, true, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "layout": "horizontal",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 5,
 "shadowSpread": 1,
 "paddingTop": 0,
 "rollOverIconURL": "skin/Button_15A15DDC_31FA_0014_41A4_CE4305FEC7D1_rollover.png",
 "propagateClick": true,
 "height": 50,
 "paddingBottom": 0,
 "label": "BACK",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "iconURL": "skin/Button_15A15DDC_31FA_0014_41A4_CE4305FEC7D1.png",
 "data": {
  "name": "Button <BACK"
 },
 "shadow": false,
 "iconWidth": 30,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "id": "Container_15A14DDC_31FA_0014_41BE_C93192DD207E",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 1,
 "backgroundOpacity": 0.5,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "line"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "id": "Container_15A16DDC_31FA_0014_4199_0FBF7553300D",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 8,
 "paddingBottom": 0,
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "class": "Container",
 "data": {
  "name": "line separator"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver"
},
{
 "rollOverShadowBlurRadius": 18,
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_15A10DDC_31FA_0014_4185_021C898E177D",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "rollOverShadow": false,
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 15,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 1"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 23,
 "fontColor": "#FFFFFF",
 "id": "Button_15A13DDC_31FA_0014_41C5_41AE80876834",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 2"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_15A12DDC_31FA_0014_416B_ED845741AE5F",
 "pressedLabel": "Lorem Ipsum",
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "rollOverBackgroundOpacity": 0.8,
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "layout": "horizontal",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 3"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_159EDDDC_31FA_0014_419A_61C18E43FE01",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 4"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_159ECDDC_31FA_0014_41B9_2D5AB1021813",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 5"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_159EFDDC_31FA_0014_41C6_9CF7032F84E0",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 6"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_159EEDDC_31FA_0014_41B6_22A86B2D2FEB",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 7"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_159E9DDC_31FA_0015_41B6_CB1D433C7673",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 8"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_159E8DDD_31FA_0014_41C5_F18F441AF371",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 9"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_159EBDDD_31FA_0014_41C8_935504B30727",
 "pressedBackgroundColor": [
  "#000000"
 ],
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "rollOverBackgroundOpacity": 0.8,
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "layout": "horizontal",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "pressedBackgroundColorRatios": [
  0
 ],
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 10"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "rollOverFontFamily": "Oswald",
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_1757CD7D_31FA_0015_4143_A9E37B16A50B",
 "rollOverFontSize": 18,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 30,
 "rollOverBackgroundOpacity": 0.8,
 "click": "this.setComponentVisibility(this.Container_17569D7D_31FA_0015_41C4_CBC688763A8D, false, 0, null, null, false); this.setComponentVisibility(this.Container_0A898462_2D0B_4D94_41B3_BDB53B7688EE, true, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "layout": "horizontal",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 5,
 "shadowSpread": 1,
 "paddingTop": 0,
 "rollOverIconURL": "skin/Button_1757CD7D_31FA_0015_4143_A9E37B16A50B_rollover.png",
 "propagateClick": true,
 "height": 50,
 "paddingBottom": 0,
 "label": "BACK",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "iconURL": "skin/Button_1757CD7D_31FA_0015_4143_A9E37B16A50B.png",
 "data": {
  "name": "Button <BACK"
 },
 "shadow": false,
 "iconWidth": 30,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "id": "Container_17579D7D_31FA_0015_41A1_D2B94269F28D",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 1,
 "backgroundOpacity": 0.5,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "line"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "id": "Container_17578D7D_31FA_0015_41BE_353D3005648A",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 8,
 "paddingBottom": 0,
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "class": "Container",
 "data": {
  "name": "line separator"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver"
},
{
 "rollOverShadowBlurRadius": 18,
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_1757AD7D_31FA_0015_41C7_FB79F56FA149",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "rollOverShadow": false,
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 15,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 1"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 23,
 "fontColor": "#FFFFFF",
 "id": "Button_17565D7D_31FA_0015_4193_78BBCB2DC70F",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 2"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_17564D7D_31FA_0015_41B8_A9191CD56C52",
 "pressedLabel": "Lorem Ipsum",
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "rollOverBackgroundOpacity": 0.8,
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "layout": "horizontal",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 3"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_17567D7D_31FA_0015_41C2_1E0D0AF05C7A",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 4"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_17566D7D_31FA_0015_41AD_98D7C60C694F",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 5"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_17561D7D_31FA_0015_41B5_BD72FAC26B8B",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 6"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_17560D7D_31FA_0015_41C4_7F0EC7540CC2",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 7"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_17562D7D_31FA_0015_41A3_96B282B30DBA",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 8"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_1756DD7D_31FA_0015_41A5_988B67FCF8B7",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 9"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_1756FD7D_31FA_0015_41C7_DA2AAC2AAAEC",
 "pressedBackgroundColor": [
  "#000000"
 ],
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "rollOverBackgroundOpacity": 0.8,
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "layout": "horizontal",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "pressedBackgroundColorRatios": [
  0
 ],
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 10"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "rollOverFontFamily": "Oswald",
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_175A5214_31FA_0014_4198_930DF49BADD9",
 "rollOverFontSize": 18,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 30,
 "rollOverBackgroundOpacity": 0.8,
 "click": "this.setComponentVisibility(this.Container_1758A215_31FA_0014_41B6_9A4A5384548B, false, 0, null, null, false); this.setComponentVisibility(this.Container_0A898462_2D0B_4D94_41B3_BDB53B7688EE, true, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "layout": "horizontal",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 5,
 "shadowSpread": 1,
 "paddingTop": 0,
 "rollOverIconURL": "skin/Button_175A5214_31FA_0014_4198_930DF49BADD9_rollover.png",
 "propagateClick": true,
 "height": 50,
 "paddingBottom": 0,
 "label": "BACK",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "iconURL": "skin/Button_175A5214_31FA_0014_4198_930DF49BADD9.png",
 "data": {
  "name": "Button <BACK"
 },
 "shadow": false,
 "iconWidth": 30,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "id": "Container_175A4215_31FA_0014_41B2_5B8676CC3F2F",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 1,
 "backgroundOpacity": 0.5,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "line"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "id": "Container_1759B215_31FA_0014_41C0_84C99CBD5517",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 8,
 "paddingBottom": 0,
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "class": "Container",
 "data": {
  "name": "line separator"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver"
},
{
 "rollOverShadowBlurRadius": 18,
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_1759A215_31FA_0014_41C7_F6B1044E5BB3",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "rollOverShadow": false,
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 15,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 1"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 23,
 "fontColor": "#FFFFFF",
 "id": "Button_17598215_31FA_0014_41AC_1166AB319171",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 2"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_1759F215_31FA_0014_41BD_BBFA5FB0D882",
 "pressedLabel": "Lorem Ipsum",
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "rollOverBackgroundOpacity": 0.8,
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "layout": "horizontal",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 3"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_1759D215_31FA_0014_41AD_B6C5744A0B97",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 4"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_17593215_31FA_0014_41C0_42BAFB0080F0",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 5"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_17592215_31FA_0014_41B2_AA3B5CC318B8",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 6"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_17590215_31FA_0014_41C1_2B2D012DCC76",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 7"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_17597215_31FA_0014_41C0_9BEE1DE4D7F6",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 8"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_17596215_31FA_0014_41C6_A42670770708",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 9"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_1758B215_31FA_0014_41BC_C4EAC2A9544B",
 "pressedBackgroundColor": [
  "#000000"
 ],
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "rollOverBackgroundOpacity": 0.8,
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "layout": "horizontal",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "pressedBackgroundColorRatios": [
  0
 ],
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 10"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "rollOverFontFamily": "Oswald",
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_17EA82B7_3106_0014_41C2_C9B0D9E6F22C",
 "rollOverFontSize": 18,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 30,
 "rollOverBackgroundOpacity": 0.8,
 "click": "this.setComponentVisibility(this.Container_17EBA2B7_3106_0014_41A9_D6C96D0633AE, false, 0, null, null, false); this.setComponentVisibility(this.Container_0A898462_2D0B_4D94_41B3_BDB53B7688EE, true, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "layout": "horizontal",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 5,
 "shadowSpread": 1,
 "paddingTop": 0,
 "rollOverIconURL": "skin/Button_17EA82B7_3106_0014_41C2_C9B0D9E6F22C_rollover.png",
 "propagateClick": true,
 "height": 50,
 "paddingBottom": 0,
 "label": "BACK",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "iconURL": "skin/Button_17EA82B7_3106_0014_41C2_C9B0D9E6F22C.png",
 "data": {
  "name": "Button <BACK"
 },
 "shadow": false,
 "iconWidth": 30,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "id": "Container_17EA92B7_3106_0014_41A6_2B88DF32BBA7",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 1,
 "backgroundOpacity": 0.5,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "line"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "id": "Container_17EAA2B7_3106_0014_41B0_ACBB1485A79E",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 8,
 "paddingBottom": 0,
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "class": "Container",
 "data": {
  "name": "line separator"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver"
},
{
 "rollOverShadowBlurRadius": 18,
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_17EAB2B7_3106_0014_41A7_209417AD3E9A",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "rollOverShadow": false,
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 15,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 1"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 23,
 "fontColor": "#FFFFFF",
 "id": "Button_17EAD2B7_3106_0014_41C0_0B5453B4841D",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 2"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_17EAE2B7_3106_0014_41C7_DB7FC43AAEE0",
 "pressedLabel": "Lorem Ipsum",
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "rollOverBackgroundOpacity": 0.8,
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "layout": "horizontal",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 3"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_17EB02B7_3106_0014_41AF_05D9AC36B189",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 4"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_17EB32B7_3106_0014_41C8_467BF6AECBE8",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 5"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_17EB42B7_3106_0014_41B0_CE70CBDDF438",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 6"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_17EB52B7_3106_0014_419C_439E593AEC43",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 7"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_17EB62B7_3106_0014_41C5_43B38271B353",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 8"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_17EB72B7_3106_0014_41B9_61857077BF4A",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 9"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_17EB92B7_3106_0014_41B2_34A3E3F63779",
 "pressedBackgroundColor": [
  "#000000"
 ],
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "rollOverBackgroundOpacity": 0.8,
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "layout": "horizontal",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "pressedBackgroundColorRatios": [
  0
 ],
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 10"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "rollOverFontFamily": "Oswald",
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_168CA310_3106_01EC_41C7_72CE0522951A",
 "rollOverFontSize": 18,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 30,
 "rollOverBackgroundOpacity": 0.8,
 "click": "this.setComponentVisibility(this.Container_168D8311_3106_01EC_41B0_F2D40886AB88, false, 0, null, null, false); this.setComponentVisibility(this.Container_0A898462_2D0B_4D94_41B3_BDB53B7688EE, true, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "layout": "horizontal",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 5,
 "shadowSpread": 1,
 "paddingTop": 0,
 "rollOverIconURL": "skin/Button_168CA310_3106_01EC_41C7_72CE0522951A_rollover.png",
 "propagateClick": true,
 "height": 50,
 "paddingBottom": 0,
 "label": "BACK",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "iconURL": "skin/Button_168CA310_3106_01EC_41C7_72CE0522951A.png",
 "data": {
  "name": "Button <BACK"
 },
 "shadow": false,
 "iconWidth": 30,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "id": "Container_168C8310_3106_01EC_4187_B16F315A4A23",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "height": 1,
 "backgroundOpacity": 0.5,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "class": "Container",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarColor": "#000000",
 "data": {
  "name": "line"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "id": "Container_168D7310_3106_01EC_41BE_5FCBD9E27BE4",
 "scrollBarMargin": 2,
 "width": "100%",
 "contentOpaque": false,
 "layout": "absolute",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 8,
 "paddingBottom": 0,
 "borderSize": 0,
 "scrollBarColor": "#000000",
 "class": "Container",
 "data": {
  "name": "line separator"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver"
},
{
 "rollOverShadowBlurRadius": 18,
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_168D6310_3106_01EC_41B8_A0B6BE627547",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "rollOverShadow": false,
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 15,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 1"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 23,
 "fontColor": "#FFFFFF",
 "id": "Button_168D5310_3106_01EC_41B5_96D9387401B8",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 2"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_168D3310_3106_01EC_41AC_5D524E4677A5",
 "pressedLabel": "Lorem Ipsum",
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "rollOverBackgroundOpacity": 0.8,
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "layout": "horizontal",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 3"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_168D2310_3106_01EC_41B8_9D7D1B2B55FA",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 4"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_168D0310_3106_01EC_41A1_FA8FC42E6FF3",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 5"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_168DE310_3106_01EC_4192_6A9F468A0ADE",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 6"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_168DD310_3106_01EC_4190_7815FA70349E",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 7"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_168DB310_3106_01EC_41B2_3511AA5E40E1",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 8"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_168DA310_3106_01EC_41BE_DF88732C2A28",
 "rollOverBackgroundOpacity": 0.8,
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "layout": "horizontal",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 9"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "gap": 5,
 "fontColor": "#FFFFFF",
 "id": "Button_168D9311_3106_01EC_41A8_3BD8769525D6",
 "pressedBackgroundColor": [
  "#000000"
 ],
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "iconHeight": 32,
 "rollOverBackgroundOpacity": 0.8,
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_21627DB7_302D_53FD_41B2_58A68D7DB3D4, true, 0, null, null, false); this.setComponentVisibility(this.Container_2FBFE191_3AA1_A2D1_4144_E7F6523C83CD, false, 0, null, null, false)",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 6,
 "minHeight": 1,
 "layout": "horizontal",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "middle",
 "paddingRight": 0,
 "borderColor": "#000000",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 10,
 "shadowSpread": 1,
 "pressedBackgroundColorRatios": [
  0
 ],
 "paddingTop": 0,
 "propagateClick": true,
 "height": 36,
 "paddingBottom": 0,
 "label": "Lorem Ipsum",
 "fontStyle": "italic",
 "borderSize": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "fontSize": 18,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "class": "Button",
 "data": {
  "name": "Button text 10"
 },
 "shadow": false,
 "iconWidth": 32,
 "iconBeforeLabel": true,
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "left",
 "maxHeight": 200,
 "maxWidth": 200,
 "id": "Image_1E18723C_57F1_802D_41C5_8325536874A5",
 "width": "25%",
 "url": "skin/Image_1E18723C_57F1_802D_41C5_8325536874A5.jpg",
 "minHeight": 1,
 "verticalAlign": "top",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 0,
 "class": "Image",
 "borderSize": 0,
 "scaleMode": "fit_inside",
 "data": {
  "name": "agent photo"
 },
 "shadow": false
},
{
 "id": "HTMLText_1E18423C_57F1_802D_41C4_458DB7F892AC",
 "scrollBarMargin": 2,
 "width": "75%",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "paddingRight": 10,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "paddingLeft": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 10,
 "borderSize": 0,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:2.4vh;font-family:'Oswald';\"><B><I>JOHN DOE</I></B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:2.3vh;font-family:'Oswald';\"><I>Licensed Real Estate Salesperson</I></SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.86vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.98vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.86vh;font-family:'Oswald';\"><I>Tlf.: +11 111 111 111</I></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.86vh;font-family:'Oswald';\"><I>jhondoe@realestate.com</I></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.86vh;font-family:'Oswald';\"><I>www.loremipsum.com</I></SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:0.98vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.98vh;font-family:Arial, Helvetica, sans-serif;\"/></p><p STYLE=\"margin:0; line-height:0.98vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.98vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.98vh;font-family:Arial, Helvetica, sans-serif;\">Mauris aliquet neque quis libero consequat vestibulum. Donec lacinia consequat dolor viverra sagittis. Praesent consequat porttitor risus, eu condimentum nunc. Proin et velit ac sapien luctus efficitur egestas ac augue. Nunc dictum, augue eget eleifend interdum, quam libero imperdiet lectus, vel scelerisque turpis lectus vel ligula. Duis a porta sem. Maecenas sollicitudin nunc id risus fringilla, a pharetra orci iaculis. Aliquam turpis ligula, tincidunt sit amet consequat ac, imperdiet non dolor.</SPAN></DIV></div>",
 "scrollBarColor": "#04A3E1",
 "class": "HTMLText",
 "data": {
  "name": "HTMLText19460"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "center",
 "maxHeight": 101,
 "maxWidth": 101,
 "id": "IconButton_2B90E40F_3593_B9CB_41B4_408768336038",
 "width": 44,
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "height": 44,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_2B90E40F_3593_B9CB_41B4_408768336038_rollover.png",
 "propagateClick": false,
 "iconURL": "skin/IconButton_2B90E40F_3593_B9CB_41B4_408768336038.png",
 "paddingBottom": 0,
 "click": "this.setComponentVisibility(this.Container_062AB830_1140_E215_41AF_6C9D65345420, true, 0, null, null, false)",
 "class": "IconButton",
 "borderSize": 0,
 "transparencyActive": true,
 "data": {
  "name": "IconButton Info"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "horizontalAlign": "center",
 "maxHeight": 101,
 "maxWidth": 101,
 "id": "IconButton_2B90C410_3593_B9D5_41AB_13AB96397D83",
 "width": 44,
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "height": 44,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_2B90C410_3593_B9D5_41AB_13AB96397D83_rollover.png",
 "propagateClick": false,
 "iconURL": "skin/IconButton_2B90C410_3593_B9D5_41AB_13AB96397D83.png",
 "paddingBottom": 0,
 "click": "this.setComponentVisibility(this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15, true, 0, null, null, false)",
 "class": "IconButton",
 "borderSize": 0,
 "transparencyActive": false,
 "data": {
  "name": "IconButton Thumblist"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "horizontalAlign": "center",
 "maxHeight": 101,
 "maxWidth": 101,
 "id": "IconButton_2B90A410_3593_B9D5_41B7_0B5CCA80EF0F",
 "width": 44,
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "height": 44,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_2B90A410_3593_B9D5_41B7_0B5CCA80EF0F_rollover.png",
 "propagateClick": false,
 "iconURL": "skin/IconButton_2B90A410_3593_B9D5_41B7_0B5CCA80EF0F.png",
 "paddingBottom": 0,
 "click": "this.setComponentVisibility(this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7, true, 0, null, null, false)",
 "class": "IconButton",
 "borderSize": 0,
 "transparencyActive": false,
 "data": {
  "name": "IconButton Location"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "horizontalAlign": "center",
 "maxHeight": 101,
 "maxWidth": 101,
 "id": "IconButton_2B917411_3593_B9D7_41C6_8D1102463EC5",
 "width": 44,
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "height": 44,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_2B917411_3593_B9D7_41C6_8D1102463EC5_rollover.png",
 "propagateClick": false,
 "iconURL": "skin/IconButton_2B917411_3593_B9D7_41C6_8D1102463EC5.png",
 "paddingBottom": 0,
 "click": "this.setComponentVisibility(this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E, true, 0, null, null, false)",
 "class": "IconButton",
 "borderSize": 0,
 "transparencyActive": false,
 "data": {
  "name": "IconButton Photoalbum"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "horizontalAlign": "center",
 "maxHeight": 101,
 "maxWidth": 101,
 "id": "IconButton_2BBEA1DF_35B3_BA4B_41B8_DE69AA453A15",
 "width": 44,
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "height": 44,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_2BBEA1DF_35B3_BA4B_41B8_DE69AA453A15_rollover.png",
 "propagateClick": false,
 "iconURL": "skin/IconButton_2BBEA1DF_35B3_BA4B_41B8_DE69AA453A15.png",
 "paddingBottom": 0,
 "click": "this.setComponentVisibility(this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41, true, 0, null, null, false)",
 "class": "IconButton",
 "borderSize": 0,
 "transparencyActive": true,
 "data": {
  "name": "IconButton Floorplan"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "horizontalAlign": "center",
 "maxHeight": 101,
 "maxWidth": 101,
 "id": "IconButton_2B721244_35B1_D9BD_41C8_FCB90D5BD7F7",
 "width": 44,
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "height": 44,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_2B721244_35B1_D9BD_41C8_FCB90D5BD7F7_rollover.png",
 "propagateClick": false,
 "iconURL": "skin/IconButton_2B721244_35B1_D9BD_41C8_FCB90D5BD7F7.png",
 "paddingBottom": 0,
 "click": "this.setComponentVisibility(this.Container_1E18823C_57F1_802D_41C1_C325A6BB2CA9, true, 0, null, null, false)",
 "class": "IconButton",
 "borderSize": 0,
 "transparencyActive": false,
 "data": {
  "name": "IconButton Realtor"
 },
 "shadow": false,
 "pressedIconURL": "skin/IconButton_2B721244_35B1_D9BD_41C8_FCB90D5BD7F7_pressed.png",
 "cursor": "hand"
},
{
 "horizontalAlign": "center",
 "maxHeight": 101,
 "maxWidth": 101,
 "id": "IconButton_2A159B11_35B0_EFD6_41C9_DF408F8120FF",
 "width": 44,
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 0,
 "transparencyActive": false,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_2A159B11_35B0_EFD6_41C9_DF408F8120FF_rollover.png",
 "propagateClick": false,
 "height": 44,
 "paddingBottom": 0,
 "class": "IconButton",
 "borderSize": 0,
 "iconURL": "skin/IconButton_2A159B11_35B0_EFD6_41C9_DF408F8120FF.png",
 "data": {
  "name": "IconButton Video"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "horizontalAlign": "center",
 "maxHeight": 101,
 "maxWidth": 101,
 "id": "IconButton_2B371BEA_35AF_6E75_41C9_D7DBED7ABF6F",
 "width": 50,
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "paddingLeft": 0,
 "transparencyActive": false,
 "paddingTop": 0,
 "propagateClick": false,
 "height": 50,
 "paddingBottom": 0,
 "class": "IconButton",
 "borderSize": 0,
 "iconURL": "skin/IconButton_2B371BEA_35AF_6E75_41C9_D7DBED7ABF6F.png",
 "data": {
  "name": "IconButton --"
 },
 "shadow": false,
 "visible": false,
 "pressedIconURL": "skin/IconButton_2B371BEA_35AF_6E75_41C9_D7DBED7ABF6F_pressed.png",
 "cursor": "hand"
}],
 "desktopMipmappingEnabled": false,
 "paddingTop": 0,
 "propagateClick": true,
 "mobileMipmappingEnabled": false,
 "paddingBottom": 0,
 "gap": 10,
 "class": "Player",
 "borderSize": 0,
 "backgroundPreloadEnabled": true,
 "scrollBarColor": "#000000",
 "height": "100%",
 "mouseWheelEnabled": true,
 "vrPolyfillScale": 0.5,
 "data": {
  "name": "Player468"
 },
 "shadow": false,
 "scrollBarOpacity": 0.5,
 "overflow": "visible",
 "scrollBarVisible": "rollOver"
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
