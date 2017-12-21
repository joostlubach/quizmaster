#import "PSParticleViewManager.h"
#import "PSParticleView.h"

@implementation PSParticleViewManager

RCT_EXPORT_MODULE();

- (PSParticleView*)view
{
  return [[PSParticleView alloc] initWithFrame:CGRectZero];
}

RCT_EXPORT_VIEW_PROPERTY(birthRate, float);
RCT_EXPORT_VIEW_PROPERTY(lifetime, float);

RCT_EXPORT_VIEW_PROPERTY(beginTimeOffset, double);
RCT_EXPORT_VIEW_PROPERTY(useCurrentMediaTime, BOOL);

RCT_EXPORT_VIEW_PROPERTY(emitterPosition, CGPoint);
RCT_EXPORT_VIEW_PROPERTY(emitterZPosition, CGFloat);
RCT_EXPORT_VIEW_PROPERTY(emitterSize, CGSize);
RCT_EXPORT_VIEW_PROPERTY(emitterDepth, CGFloat);

RCT_EXPORT_VIEW_PROPERTY(emitterShape, NSString *);
RCT_EXPORT_VIEW_PROPERTY(emitterMode, NSString *);
RCT_EXPORT_VIEW_PROPERTY(renderMode, NSString *);

RCT_EXPORT_VIEW_PROPERTY(preservesDepth, BOOL);
RCT_EXPORT_VIEW_PROPERTY(velocity, float);
RCT_EXPORT_VIEW_PROPERTY(scale, float);

RCT_EXPORT_VIEW_PROPERTY(spin, float);
RCT_EXPORT_VIEW_PROPERTY(seed, int);

RCT_EXPORT_VIEW_PROPERTY(emitterLayerRenderMode, NSString *);

RCT_EXPORT_VIEW_PROPERTY(dynamicProperties, NSArray<NSDictionary *> *);

@end
