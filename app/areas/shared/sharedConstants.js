sharedModule.constant('sharedConstants', {
    editButtonUrl: 'app/authorizedElements/editButton.html',
    deleteButtonUrl: 'app/authorizedElements/deleteButton.html',
    blockButtonUrl: 'app/authorizedElements/blockButton.html',
    editPencilButtonUrl: 'app/authorizedElements/editPencilButton.html',
    avatarProfilePhotoUrl: '../../../../theme/default/img/avatar_icon.jpg',
    addSecurityGroupButtonUrl: 'app/authorizedElements/addSecurityGroupButton.html',
    PageSize: 20,
    ClientCacheSize: 1000,
    ISONameNL: 'NL',
    ISONameFR: 'FR',
    delayTime: 1000,//Used in tmlDebounce for search input delay,
    CommentRequestUrl: '/api/v1/comments',
    ReviewCommentRequestUrl: '/api/v1/Reviewcomments',
    ReviewCommentRole: 'ObjectReviewer',
    notificationUrl: '/api/v1/notification',
    ReviewLearningObjectUrl: '/api/v1/ReviewLearningObject',
    AvailableStateId: 1,
    InReviewStateId: 2,
    DraftStateId: 3,
    unBlockedUserNameStyle: 'link-username',
    blockedUserNameStyle: 'link-blocked-username',
    CodeValueListUrl: '/api/v1/codevaluelist',
    EmptyString: '',
    TranslationValue: 'TranslationValue',
    TechniqueId: 'TechniqueId',
    success: 'success',
    warning: 'warning',
    error: 'error',
    CommentsController: 'commentsController',

    //codeValueController : Edit(codeValueId, currentLanguageId, IsProfession)
    //materialService : _getMaterialEdit
    //professionService - _getProfessionEdit
    //techniqueService : _getTechniqueEdit

    //codeValueController : Delete (codeValueId, codeType)
    //materialService : _deleteMaterial
    //professionService - _deleteProfession
    //techniqueService : _deleteTechnique
    GetCodeValueIdUrl: '/api/v1/codevalue?codeValueId=',

    CodeValueUrl: '/api/v1/codevalue',      
    TimeDelayForComments: '1',
    Uploader : 'Uploader'
});