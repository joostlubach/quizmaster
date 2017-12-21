#import <UIKit/UIKit.h>

static const CGFloat kMillisecondsPerSecond = 1000.0;

@interface PSParticleCell : UIView

@property (nonatomic) CAEmitterCell *emitterCell;
@property (nonatomic) BOOL enabled;
@property (nonatomic, copy) void (^emitterSetupCompletion)(CAEmitterCell*);
@end
